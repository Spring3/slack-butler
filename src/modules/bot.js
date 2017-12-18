const { rtm, web, EVENTS } = require('../utils/slack.js');
const ChatCommand = require('./command');
const ChatMessage = require('./chatMessage.js');
const mongo = require('./mongo');
const Channel = require('./channel');
const assert = require('assert');
const blacklist = require('./blacklist');

let botInstance;

class Bot {
  constructor({ name, id }, channels) {
    assert(Array.isArray(channels));
    this.name = name;
    this.id = id;
    this.channels = new Map(channels.map(channelData => [channelData.id, new Channel(channelData, this.id)]));
    this.blacklist = blacklist;
    botInstance = this;
  }

  async react(message, emoji = 'star') {
    try {
      await web.reactions.add(emoji, {
        channel: message.channel,
        timestamp: message.timestamp,
      });
      message.mark();
    } catch (e) {
      console.error(e);
    }
  }

  static start() {
    rtm.start();
  }

  static get instance() {
    return botInstance;
  }

  init() {
    rtm.on(EVENTS.RTM.RAW_MESSAGE, async (msg) => {
      const channelId = JSON.parse(msg).channel;
      const channel = botInstance.channels.get(channelId) || { name: 'DM', id: channelId, botId: botInstance.id };
      const message = new ChatMessage(msg, channel);
      if (message.isTextMessage() && message.author !== botInstance.id) {
        if (message.hasLink) {
          const links = message.getLinks();
          const db = await mongo.connect();
          for (const link of links) {
            db.collection('Links').findOneAndUpdate({ href: link.href, 'channel.id': message.channel }, {
              $setOnInsert: {
                link,
                channel: {
                  id: message.channel.id,
                  name: channel.name
                },
                author: message.author,
                createdAt: new Date()
              },
            }, { upsert: true });
          }
          if (!message.isMarked()) {
            botInstance.react(message);
          }
        } else {
          const command = ChatCommand.fromMessage(message);
          if (command) {
            command.execute(message.getDirectMessage(), botInstance);
          }
        }
      }
    });

    rtm.on(EVENTS.RTM.CHANNEL_RENAME, async (msg) => {
      const channelId = msg.channel.id;
      if (botInstance.channels.has(channelId)) {
        botInstance.channels.get(channelId).name = msg.channel.name;
        const db = await mongo.connect();
        await db.collection('Links').update(
          { 'channel.id': channelId },
          {
            $set: {
              'channel.name': msg.channel.name
            }
          },
          { multi: true }
        );
      }
    });

    rtm.on(EVENTS.RTM.CHANNEL_JOINED, (data) => {
      const memberId = data.user;
      const channelId = data.channel;
      if (botInstance.channels.has(channelId)) {
        const channel = botInstance.channels.get(channelId);
        channel.memberJoined(memberId);
        rtm.sendMessage(`Welcome to the \`${channel.name}\` channel, <@${memberId}>!`, channelId);
      }
    });

    rtm.on(EVENTS.RTM.CHANNEL_LEFT, (data) => {
      const memberId = data.user;
      const channelId = data.channel;
      if (botInstance.channels.has(channelId)) {
        botInstance.channels.get(channelId).memberLeft(memberId);
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

module.exports = Bot;
