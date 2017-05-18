const AbstractCommand = require('./abstractCommand');
const Bot = require('./../bot');

class BlacklistCommand extends AbstractCommand {
  constructor(rtm, chatMessage) {
    super(rtm, chatMessage);
  }

  handle(message, channel) {
    super.handle(message, channel);
    this.rtm.sendMessage(`Blacklist: ${Bot.instance.blacklist.getValues()}`, channel);
  }
}

module.exports = BlacklistCommand;
