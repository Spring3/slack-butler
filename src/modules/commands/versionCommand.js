const Command = require('./command.js');

/**
 * Command to display the verion of the bot
 */
class VersionCommand extends Command {
  constructor(chatMessage) {
    super(chatMessage);
  }

  handle(message, channel) {
    super.handle(message, channel);
    this.rtm.sendMessage('v2.0-alpha', channel);
  }
}

module.exports = VersionCommand;
