const Command = require('./command');
const blacklist = require('../blacklist.js');

class BanCommand extends Command {
  constructor(chatMessage) {
    super(chatMessage);
  }

  handle(message, channel) {
    super.handle(message, channel);
    const messageParts = message.split(' ');
    if (messageParts.length > 1) {
      blacklist.ban(messageParts[1].toLowerCase().trim());
    }
    this.rtm.sendMessage(`Blacklist: ${blacklist.getValues()}`, channel);
  }
}

module.exports = BanCommand;
