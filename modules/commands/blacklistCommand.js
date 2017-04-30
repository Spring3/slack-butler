const AbstractCommand = require('./abstractCommand');

class BlacklistCommand extends AbstractCommand {
  constructor(rtm, chatMessage) {
    super(rtm, chatMessage);
  }

  handle(message, channel) {
    super.handle(message, channel);
  }
}

module.exports = BlacklistCommand;
