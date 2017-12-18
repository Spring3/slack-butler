const assert = require('assert');
const { rtm } = require('../../utils/slack.js');

class Command {
  constructor(chatMessage, bot) {
    this.chatMessage = chatMessage;
    this.bot = bot;
    this.rtm = rtm;
  }

  handle(message, channel) {
    assert(message);
    assert(channel);
  }
}

module.exports = Command;
