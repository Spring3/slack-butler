const AbstractCommand = require('./abstractCommand');

class UnBanCommand extends AbstractCommand {
  constructor(rtm, chatMessage) {
    super(rtm, chatMessage);
  }

  handle(message, channel) {
    super.handle(message, channel);
  }
}

module.exports = UnBanCommand;
