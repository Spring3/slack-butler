const Command = require('./command');
const blacklist = require('../modules/blacklist.js');

/**
 * A command to display the current blacklist of urls
 */
class BlacklistCommand extends Command {
  constructor(chatMessage) {
    super(chatMessage);
  }

  handle(message, channel) {
    super.handle(message, channel);
    this.rtm.sendMessage(`Blacklist: ${blacklist.getValues()}`, channel);
  }
}

module.exports = BlacklistCommand;
