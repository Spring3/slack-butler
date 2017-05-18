const { RtmClient } = require('@slack/client');
const EVENTS = require('@slack/client').CLIENT_EVENTS;
const Bot = require('./../modules/bot');
const ChatMessage = require('./../modules/chatMessage');
const ChatCommand = require('./../modules/command');
const mongo = require('./mongo').instance;

const linksCollection = mongo.collection('Links');
const rtm = new RtmClient(process.env.SLACK_BOT_TOKEN);

let bot;

rtm.on(EVENTS.RTM.AUTHENTICATED, (data) => {
  const matchedChannels = data.channels.filter(channel => channel.name === process.env.SLACK_CHANNEL);
  if (matchedChannels.length === 0) {
    throw new Error('Unable to find the matching channel');
  }
  if (!bot) {
    bot = new Bot(data.self, matchedChannels[0]);
    console.log(`Logged in as @${bot.name}. Main channel: ${bot.mainChannel.name}`);
  }
});

rtm.on(EVENTS.RTM.RTM_CONNECTION_OPENED, () => {});

rtm.on(EVENTS.RTM.RAW_MESSAGE, async (msg) => {
  const message = new ChatMessage(JSON.parse(msg));
  if (message.isTextMessage() && message.author !== bot.id) {
    if (message.containsLink()) {
      const links = message.getLinks();
      for (const link of links) {
        const existing = await linksCollection.findOne({ href: link.href });
        if (!existing) {
          await linksCollection.insert(Object.assign(link, { author: message.author }));
        }
      }
      if (!message.isMarked()) {
        bot.react(message);
        message.mark();
      }
    } else {
      const command = ChatCommand.fromMessage(message);
      if (command) {
        command.execute(rtm, message.getDirectMessage());
      }
    }
  }
});

rtm.on('member_joined_channel', (data) => {
  const memberId = data.user;
  const channelId = data.channel;
  if (bot.mainChannel.id === channelId) {
    bot.mainChannel.joined(memberId);
    rtm.sendMessage(`Welcome to the \`${bot.mainChannel.name}\` channel, <@${memberId}>!`, channelId);
  } 
});

rtm.on('member_left_channel', (data) => {
  const memberId = data.user;
  const channelId = data.channel;
  if (bot.mainChannel.id === channelId) {
    bot.mainChannel.left(memberId);
  }
});

module.exports.start = () => rtm.start();
