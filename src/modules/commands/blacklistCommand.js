const Command = require('./command');
const blacklist = require('../blacklist.js');

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
