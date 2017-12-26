const { rtm, web, EVENTS } = require('../utils/slack.js');
const mongo = require('./mongo');
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
  }

  async react(message, emoji = 'star') {
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
          if (message.hasLink) {
            const links = message.getLinks();
            const db = await mongo.connect();
            for (const [link] of links) {
              db.collection('Links').findOneAndUpdate({ href: link.href, 'channel.id': message.channel.id }, {
                $setOnInsert: {
                  href: link.href,
                  caption: link.caption,
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
              this.react(message);
            }
          } else {
            const command = message.getCommand();
            if (command) {
              command.execute(message.getDirectMessage(), message.channel.id);
            }
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
