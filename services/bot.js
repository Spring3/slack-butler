const { RtmClient, WebClient } = require('@slack/client');
const EVENTS = require('@slack/client').CLIENT_EVENTS;
const request = require('request');
const db = require('./db');

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
  'Star, at your service!', 
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
    // link sent to private messages or into a channel
    if (text.indexOf('http://') >= 0 || text.indexOf('https://') >= 0) {
      rtm.sendMessage(`<@${user}>, I'll remember that.. :smiling_imp:`, channel);
    }
    // if mention
    if (text.indexOf(`<@${botId}>`) >= 0) {
      const mentionedMessage = text.replace(`<@${botId}>`, '').toLowerCase().trim();
      // greeting
      const greetings = ['hey', 'hi', 'hello', 'howdy', 'yo', 'greetings'];
      if (greetings.includes(mentionedMessage.replace(/[^\w\s]/gi, ''))) {
        rtm.sendMessage(`<@${user}>, hello, friend! :blush:`, channel);
        return;
      }

      // interations via mentions
      switch (mentionedMessage) {
        case 'scan': {
          //rtm.sendMessage(`Scanning current channel for links and attachments...`, channel);
          return fetchMessages(channel).then(processMessages);
        }
        case 'clear': {
          return fetchMessages(channel).then((chunkOfMessages) => {
            const toRemove = [];
            for(const key of chunkOfMessages.keys()) {
              const messages = chunkOfMessages.get(key);
              messages.forEach((msg) => {
                if (msg.user === botId) {
                  toRemove.push(msg);
                }
              });
            }
            toRemove.forEach((msg) => {
              request.post({
                url: 'https://slack.com/api/chat.delete',
                headers: {
                  'Content-Type': 'application/json;charset=utf-8'
                },
                qs: {
                  token: process.env.SLACK_API_TOKEN,
                  ts: msg.ts,
                  as_user: true,
                  channel
                }
              }, function(err, response) { console.log(response.body); });
            });
          });
        }
        case 'help': {
          rtm.sendMessage(`Hi, <@${user}>! My name is Star - and my purpose is to save the links and attachments that people share in this channel.`, channel);
          rtm.sendMessage('You may want to ask me for some of them. Simply ping me with one of the supported commands:' +
          '```\n\'list\' - to display all saved items.\n' +
               '\'list n\' - give a list of last n links saved.\n' +
               '\'list n-m\' - print the lsit of links from n (inc) to m (exc).\n' +
               '\'total\' - print the amount of links saved.\n' +
               '\'clear\' - to remote my messages from this channel.\n' +
               '\'scan\' - to scan current channel for links and attachments.\n```', channel);
          break;
        }
        default: {}

      }
    }
  }
});

function fetchMessages(channel) {
  return new Promise((resolve, reject) => {
    const chunks = new Map();
    const parse = (err, chunkOfData) => {
      const hasMore = chunkOfData.has_more;
      if (err) {
        console.error(err);
        return reject(err);
      }
      chunkOfData = chunkOfData.messages;
      chunks.set(`chunk${chunks.size}`, chunkOfData);
      if (hasMore) {
        const lastTs = chunkOfData[chunkOfData.length - 1].ts;
        request.get({
          url: 'https://slack.com/api/channels.history',
          qs: {
            token: process.env.SLACK_API_TOKEN,
            latest: lastTs,
            inclusive: 1,
            channel
          },
        }, function(err, response) {
          parse(err, JSON.parse(response.body));
        });
      } else {
        return resolve(chunks);
      }
    }
    web.channels.history(channel, parse);
  });
}

function processMessages(chunks) {
  const urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
  const links = new Set();
  const blacklist = process.env.LINK_BLACKLIST.split(',');
  for(const key of chunks.keys()) {
    const messages = chunks.get(key);
    messages.map((msg) => msg.text.match(urlPattern))
    .filter((link) => {
      if (!link)
        return false;

      let isValid = true;
      blacklist.forEach((restrictedValue) => {
        if (link[0].indexOf(restrictedValue) >= 0) {
          isValid = false;
          return isValid;
        }
      });
      return isValid;
    })
    .forEach((link) => links.add(link));
    //.filter((msg) => msg.indexOf('http://') >= 0 || msg.indexOf('https://') >= 0)
  }
  const dbPayload = [];
  for(const value of links.values()) {
    // getting the link name, replacing / with spaces, then trimming to get rid of start and end spaces and getting the name part
    // for /bnoguchi/hooks-js it will be hooks-js
    let name;
    if (value[3]) {
      name = value[3].replace(new RegExp('/', 'g'), ' ').trim().split(' ');
      name = name[name.length - 1];
      if (name)
        name = name.split('?')[0]; // to get rid of query parameters
    }

    //if name was not set or it is a number
    if (!name || /^\d+$/.test(name)) {
      // just taking the website name as a caption for the link
      name = value[0].split('//')[1].split('?')[0];
    }
    dbPayload.push({
      caption: name,
      link: value[0]
    });
  }
  const totalLinks = links.size;
  links.clear();
  db.insert(dbPayload).then((result) => {
    console.log(`Total links found: ${totalLinks}. New: ${result.new}. Blacklist: ${blacklist}`);
  });
  // to do - write total links / new links / blacklist
}

module.exports.start = () => {
  rtm.start();
}
