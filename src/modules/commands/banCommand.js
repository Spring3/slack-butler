const Command = require('./command');
const blacklist = require('../blacklist.js');

class BanCommand extends Command {
  constructor(chatMessage) {
    super(chatMessage);
  }

  handle(message, channel) {
    super.handle(message, channel);
    blacklist.ban(message.split(' ')[1].toLowerCase().trim());
    this.rtm.sendMessage(`Blacklist: ${blacklist.getValues()}`, channel);
  }
}

module.exports = BanCommand;
