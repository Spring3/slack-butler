const { rtm, web, EVENTS } = require('../utils/slack.js');
const {
  autoScanInterval,
  scanTriggerEmoji,
  reactionEmoji,
  favoritesReactionEmoji
} = require('./configuration.js');
const mongo = require('./mongo');
const Links = require('./entities/links.js');
const Highlights = require('./entities/highlights.js');
const Channel = require('./channel');
const assert = require('assert');
const blacklist = require('./blacklist');

let botInstance;

class Bot {
  constructor({ name, id }, channels) {
    assert(Array.isArray(channels), 'Channels array is undefined');
    this.name = name;
    this.id = id;
    this.channels = new Map(channels.map(channelData => [channelData.id, new Channel(channelData, this.id)]));
    this.blacklist = blacklist;
    if (autoScanInterval) {
      this.scanningInterval = this.beginScanningInterval();
    }
  }

  async react(message, emoji = reactionEmoji.toLowerCase()) {
    try {
      await web.reactions.add(emoji, {
        channel: message.channel.id || message.channel,
        timestamp: message.timestamp,
      });
      message.mark();
    } catch (e) {
      console.error(e);
    }
  }

  beginScanningInterval() {
    return setInterval(() => {
      const command = `<@${this.id}> scan`;
      for (const [id, channel] of this.channels.entries()) { // eslint-disable-line no-unused-vars
        const chatMessage = channel.getMessage({
          type: 'message',
          text: command
        });
        chatMessage.getCommand().getHandler().handle(chatMessage.getDirectMessage(), channel.id);
      }
    }, parseInt(autoScanInterval, 10));
  }

  static shutdown() {
    if (botInstance && botInstance.scanningInterval) {
      clearInterval(botInstance.scanningInterval);
    }
  }

  static start() {
    rtm.start();
  }

  init() {
    rtm.on(EVENTS.RTM.RAW_MESSAGE, async (msg) => {
      const jsonMessage = JSON.parse(msg);
      if (jsonMessage.channel) {
        const channel = this.channels.get(jsonMessage.channel) || new Channel({ id: jsonMessage.channel }, this.id);
        const message = channel.getMessage(msg);
        if (message.isTextMessage() && message.author !== this.id) {
          if (message.hasLink && message.isMarkedToScan()) {
            Links.save(message);
            if (!message.isMarked()) {
              this.react(message);
            }
          } else {
            const command = message.getCommand();
            if (command) {
              command.getHandler().handle(message.getDirectMessage(), message.channel.id, { replyOnFinish: true });
            }
          }
        }
      }
    });

    rtm.on('reaction_added', async (msg) => {
      const jsonMessage = typeof msg === 'string' ? JSON.parse(msg) : msg;
      if (!scanTriggerEmoji) return;
      const payload = jsonMessage.item;
      if (
        jsonMessage.reaction === scanTriggerEmoji.toLowerCase()
        && jsonMessage.user !== this.id
        && payload.type === 'message'
      ) {
        const channel = this.channels.get(payload.channel) || new Channel({ id: payload.channel, name: 'DM' }, this.id);
        const message = await channel.fetchMessage(payload.ts);
        if (message.isTextMessage() && message.isMarkedToScan() && message.hasLink) {
          Links.save(message).then(() => Highlights.save(message));
          if (!message.isMarked()) {
            this.react(message, favoritesReactionEmoji.toLowerCase());
          }
        }
      }
    });

    rtm.on('channels_rename', async (msg) => {
      const jsonMessage = typeof msg === 'string' ? JSON.parse(msg) : msg;
      const channelId = jsonMessage.channel.id;
      if (this.channels.has(channelId)) {
        this.channels.get(channelId).name = jsonMessage.channel.name;
        const db = await mongo.connect();
        await db.collection('Links').update(
          { 'channel.id': channelId },
          {
            $set: {
              'channel.name': jsonMessage.channel.name
            }
          },
          { multi: true }
        );
      }
    });

    rtm.on('member_joined_channel', async (data) => {
      const memberId = data.user;
      const channelId = data.channel;
      if (this.channels.has(channelId)) {
        // somebody joined a channel
        const channel = this.channels.get(channelId);
        channel.memberJoined(memberId);
        rtm.sendMessage(`Welcome to the \`${channel.name}\` channel, <@${memberId}>!`, channelId);
      } else {
        // bot joined a channel
        let channelData = await web.channels.info(channelId);
        channelData = typeof channelData === 'string' ? JSON.parse(channelData) : channelData;
        this.channels.set(channelId, new Channel(channelData.channel, this.id));
      }
    });

    rtm.on('member_left_channel', (data) => {
      const memberId = data.user;
      const channelId = data.channel;
      if (this.channels.has(channelId)) {
        if (memberId === this.id) {
          // bot left a channel
          this.channels.delete(channelId);
        } else {
          // somebody left a channel
          this.channels.get(channelId).memberLeft(memberId);
        }
      }
    });
  }
}

rtm.on(EVENTS.RTM.AUTHENTICATED, async (data) => {
  if (!botInstance) {
    botInstance = new Bot(data.self, data.channels.filter((channel => channel.is_channel && channel.is_member)));
    botInstance.init();
  }
});

module.exports.Bot = Bot;
module.exports.getInstance = () => botInstance;
