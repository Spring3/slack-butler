const { RtmClient, WebClient } = require('@slack/client');
const EVENTS = require('@slack/client').CLIENT_EVENTS;
const Bot = require('./../modules/bot');
const ChatMessage = require('./../modules/chatMessage');
const mongo = require('./mongo').instance;

const rtm = new RtmClient(process.env.SLACK_BOT_TOKEN);
const web = new WebClient(process.env.SLACK_API_TOKEN);

let bot;

rtm.on(EVENTS.RTM.AUTHENTICATED, (data) => {
  const matchedChannels = data.channels
    .filter(channel => channel.name === process.env.SLACK_CHANNEL);
  if (matchedChannels.length === 0) {
    throw new Error('Unable to find the matching channel');
  }
  if (!bot) {
    bot = new Bot(data.self, matchedChannels[0]);
    console.log(`Logged in as @${bot.name}. Main channel: ${bot.mainChannel.name}`);
  }
});

rtm.on(EVENTS.RTM.RTM_CONNECTION_OPENED, () => {});

rtm.on(EVENTS.RTM.RAW_MESSAGE, (msg) => {
  const message = new ChatMessage(JSON.parse(msg));
  if (message.isTextMessage() && message.author !== bot.id) {
    if (message.containsLink()) {
      const links = message.getLinks();
      const collection = mongo.collection('Links');
      for (const link of links) {
        collection.insert(link);
      }
    } else if (message.isCommand()) {
      const command = message.getCommand();
      command.execute(rtm, message.getDirectMessage());
    }
  }
});

module.exports.start = () => {
  rtm.start();
};
