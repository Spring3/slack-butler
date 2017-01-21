const { RtmClient } = require('@slack/client');
const EVENTS = require('@slack/client').CLIENT_EVENTS;

const rtm = new RtmClient(process.env.SLACK_BOT_TOKEN);
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
  'Ouch, develo-bears!',
  'Hi everyone :blush:!',
  'Hey there!'];
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];
  rtm.sendMessage(greeting, writeChannel);
});

rtm.on(EVENTS.RTM.WS_CLOSE, () => {
  rtm.sendMessage('*yawns* Off for some lunch. Whoops.. khm.. I mean, sleep', writeChannel);
});

rtm.on(EVENTS.RTM.RAW_MESSAGE, (msg) => {
  msg = JSON.parse(msg);
  if (msg.type === 'message') {
    const user = msg.user;
    const text = msg.text;
    const channel = msg.channel;
    // lint sent to private messages or into a channel
    if (text.indexOf('http://') >= 0 || text.indexOf('https://') >= 0) {
      rtm.sendMessage(`<@${user}>, I'll remember that.. :smiling_imp:`, channel);
    }
    // mention greeting
    if (text.indexOf(`<@${botId}>`) >= 0) {
      const mentionedMessage = text.replace(`<@${botId}>`, '').toLowerCase().trim();
      const greetings = ['hey', 'hi', 'hello', 'howdy', 'yo', 'greetings'];
      if (greetings.includes(mentionedMessage.replace(/[^\w\s]/gi, ''))) {
        rtm.sendMessage(`<@${user}>, hello, friend! :blush:`, channel);
      }
    }
  }
});

module.exports.start = () => {
  rtm.start();
}
