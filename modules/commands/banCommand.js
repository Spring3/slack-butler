const AbstractCommand = require('./abstractCommand');
const Bot = require('./../bot');

class BanCommand extends AbstractCommand {
  constructor(rtm, chatMessage) {
    super(rtm, chatMessage);
  }

  handle(message, channel) {
    super.handle(message, channel);
    const bot = Bot.instance;
    bot.blacklist.ban(message.split(' ')[1].toLowerCase().trim());
    this.rtm.sendMessage(`Blacklist: ${bot.blacklist.getValues()}`, channel);
  }
}

module.exports = BanCommand;
