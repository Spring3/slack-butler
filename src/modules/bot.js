const { rtm, userRtm, web, EVENTS } = require('../utils/slack.js');
const { auto_scan_interval, scan_trigger_emoji, reaction_emoji } = require('./configuration.js');
const mongo = require('./mongo');
const Links = require('./entities/links.js');
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
    if (auto_scan_interval) {
      this.scanningInterval = this.beginScanningInterval();
    }
  }

  async react(message, emoji = reaction_emoji.toLowerCase()) {
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
      const command = `<@${this.id}> scan`
      for (const [id, channel] of this.channels.entries()) {
        const chatMessage = channel.getMessage({
          type: 'message',
          text: command
        });
        chatMessage.getCommand().execute(chatMessage.getDirectMessage(), channel.id);
      }
    }, parseInt(auto_scan_interval, 10));
  }

  static shutdown() {
    if (botInstance && botInstance.scanningInterval) {
      clearInterval(botInstance.scanningInterval)
    }
  }

  static start() {
    rtm.start();
  }

  init() {
    rtm.on(EVENTS.RTM.RAW_MESSAGE, async (msg) => {
      const jsonMessage = JSON.parse(msg);
      if (jsonMessage.channel) {
        const channel = this.channels.get(jsonMessage.channel) || new Channel({ id: jsonMessage.channel }, this.id );
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
              command.execute(message.getDirectMessage(), message.channel.id, { replyOnFinish: true });
            }
          }
        }
      }
    });

    userRtm.on(EVENTS.RTM.REACTION_ADDED, async (msg) => {
      const jsonMessage = typeof msg === 'string' ? JSON.parse(msg) : msg;
      if (!scan_trigger_emoji) return;
      const payload = jsonMessage.item;
      if (jsonMessage.reaction === scan_trigger_emoji.toLowerCase() && jsonMessage.user !== this.id && payload.type === 'message') {
        const channel = this.channels.get(payload.channel) || new Channel({ id: payload.channel, name: 'unknown'}, this.id);
        const message = await channel.fetchMessage(payload.ts);
        if (message.isTextMessage() && message.isMarkedToScan() && message.hasLink) {
          Links.save(message);
          if (!message.isMarked()) {
            this.react(message);
          }
        }
      }
    });

    rtm.on(EVENTS.RTM.CHANNEL_RENAME, async (msg) => {
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

    rtm.on(EVENTS.RTM.CHANNEL_JOINED, (data) => {
      const memberId = data.user;
      const channelId = data.channel;
      if (this.channels.has(channelId)) {
        const channel = this.channels.get(channelId);
        channel.memberJoined(memberId);
        rtm.sendMessage(`Welcome to the \`${channel.name}\` channel, <@${memberId}>!`, channelId);
      }
    });

    rtm.on(EVENTS.RTM.CHANNEL_LEFT, (data) => {
      const memberId = data.user;
      const channelId = data.channel;
      if (this.channels.has(channelId)) {
        this.channels.get(channelId).memberLeft(memberId);
      }
    });
  }
}

rtm.on(EVENTS.RTM.AUTHENTICATED, (data) => {
  if (!botInstance) {
    botInstance = new Bot(data.self, data.channels.filter((channel => channel.is_channel && channel.is_member)));
    botInstance.init();
  }
});

module.exports.Bot = Bot;
module.exports.getInstance = () => {
  return botInstance;
};
