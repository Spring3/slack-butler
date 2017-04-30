const AbstractCommand = require('./abstractCommand');

class BanCommand extends AbstractCommand {
  constructor(rtm, chatMessage) {
    super(rtm, chatMessage);
  }

  handle(message, channel) {
    super.handle(message, channel);
  }
}

module.exports = BanCommand;
