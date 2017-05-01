const { WebClient } = require('@slack/client');
const Channel = require('./channel');
const assert = require('assert');
const blacklist = require('./../modules/blacklist');

let bot;

class Bot {
  constructor(botInfo, channelData) {
    assert(botInfo);
    assert(channelData);
    this.name = botInfo.name;
    this.id = botInfo.id;
    this.webClient = new WebClient(process.env.SLACK_BOT_TOKEN);
    this.mainChannel = new Channel(channelData);
    this.blacklist = blacklist;
    for (const blackListKey of process.env.LINK_BLACKLIST.split(',')) {
      blacklist.ban(blackListKey);
    }
    bot = bot || this;
  }

  react(message) {
    this.webClient.reactions.add('star', {
      channel: message.channel,
      timestamp: message.timestamp,
    }).catch(() => {});
  }

  static get instance() {
    return bot;
  }
}

module.exports = Bot;