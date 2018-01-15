const assert = require('assert');
const { rtm } = require('../../utils/slack.js');

class Command {
  /**
   * Constructs the instance of a Command
   * @param  {ChatMessage} chatMessage - an instance of a ChatMessage based on the message received by the RTM
   * @return {Command}
   */
  constructor(chatMessage) {
    this.chatMessage = chatMessage;
    this.rtm = rtm;
  }

  /**
   * Command handler function
   * @param  {string} message - command options.
   * @param  {string} channel - slack id of the channel
   * @return {undefined}
   */
  handle(message, channel) {
    assert(message, 'Command message is undefined');
    assert(channel, 'Command channel is undefined');
  }
}

module.exports = Command;
