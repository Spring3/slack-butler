const { RtmClient, WebClient } = require('@slack/client');
const EVENTS = require('@slack/client').CLIENT_EVENTS;
const request = require('request');

const rtm = new RtmClient(process.env.SLACK_BOT_TOKEN);
const web = new WebClient(process.env.SLACK_API_TOKEN);
let writeChannel, botId;

rtm.on(EVENTS.RTM.AUTHENTICATED, (data) => {
  const matchedChannels = data.channels.filter((channel) => channel.name === process.env.SLACK_CHANNEL);
  if (matchedChannels.length === 0) {
    throw new Error('Unable to find the matching channel');
  }
  const targetChannel = matchedChannels[0];
  writeChannel = targetChannel.id;
  botId = data.self.id;
  console.log(`Logged in as @${data.self.name} of team ${data.team.name}, found the channel ${targetChannel.name}`);
});

rtm.on(EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  const greetings = [
  'Star, bot for hire', 
  'I usually do not work as a bot, but 20$ is 20$...', 
  'I believe I can touch the... Khm.. Star, at your service!', 
  'Hi everyone :blush:!',
  'Hey there!'];
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];
  // rtm.sendMessage(greeting, writeChannel);
});

rtm.on(EVENTS.RTM.WS_CLOSE, () => {
  rtm.sendMessage('*yawns* Off for some lunch. Whoops.. khm.. I mean, sleep', writeChannel);
});

rtm.on(EVENTS.RTM.RAW_MESSAGE, (msg) => {
  msg = JSON.parse(msg);
  if (msg.type === 'message' && !msg.subtype) {
    const user = msg.user;
    const text = msg.text;
    const channel = msg.channel;
    // lint sent to private messages or into a channel
    if (text.indexOf('http://') >= 0 || text.indexOf('https://') >= 0) {
      rtm.sendMessage(`<@${user}>, I'll remember that.. :smiling_imp:`, channel);
    }
    // mention
    if (text.indexOf(`<@${botId}>`) >= 0) {
      const mentionedMessage = text.replace(`<@${botId}>`, '').toLowerCase().trim();
      // greeting
      const greetings = ['hey', 'hi', 'hello', 'howdy', 'yo', 'greetings'];
      if (greetings.includes(mentionedMessage.replace(/[^\w\s]/gi, ''))) {
        rtm.sendMessage(`<@${user}>, hello, friend! :blush:`, channel);
        return;
      }

      // api
      // scan
      switch (mentionedMessage) {
        case 'scan': 
          //rtm.sendMessage(`Scanning current channel for links and attachments...`, channel);
          let len = 0;
          const links;
          const parse = (err, dataChunk) => {
            const hasMore = dataChunk.has_more;
            if (err) {
              console.error(err);
              throw err;
            }
            dataChunk = dataChunk.messages;
            len += dataChunk.length;
            if (hasMore) {
              const lastTs = dataChunk[dataChunk.length - 1].ts;
              request.get({
                url: 'https://slack.com/api/channels.history',
                qs: {
                  token: process.env.SLACK_API_TOKEN,
                  latest: lastTs,
                  inclusive: 1,
                  channel
                },
              }, function (err, response) {
                  parse(err, JSON.parse(response.body));
              });
            }
          }
          web.channels.history(channel, parse);
        break;
        case 'help':
          rtm.sendMessage(`Hi, <@${user}>! My name is Star - and my purpose is to save the links and attachments that people share in this channel.`, channel);
          rtm.sendMessage('You may want to ask me for some of them. Simply ping me with one of the supported commands:' +
          '```\n*list* - to display all saved items.\n*list n* - give a list of last n links saved.\n*scan* - to scan current channel for links and attachments.\n```', channel);
          break;
        default:

      }
    }
  }
});

module.exports.start = () => {
  rtm.start();
}
