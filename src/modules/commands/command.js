const assert = require('assert');
const { rtm } = require('../../utils/slack.js');

class Command {
  constructor(chatMessage) {
    this.chatMessage = chatMessage;
    this.rtm = rtm;
  }

  handle(message, channel) {
    assert(message, 'Command message is undefined');
    assert(channel, 'Command channel is undefined');
  }
}

module.exports = Command;
