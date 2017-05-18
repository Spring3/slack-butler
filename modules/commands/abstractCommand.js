const assert = require('assert');

class AbstractCommand {
  constructor(rtm, chatMessage) {
    assert(rtm);
    this.rtm = rtm;
    this.chatMessage = chatMessage;
  }

  handle(message, channel) {
    assert(message);
    assert(channel);
  }
}

module.exports = AbstractCommand;
