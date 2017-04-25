const AbstractCommand = require('./abstractCommand');

class TotalCommand extends AbstractCommand {
  constructor(rtm, chatMessage) {
    super(rtm, chatMessage);
  }

  handle(message, channel) {
    super.handle(message, channel);
    /*
      db.getTotalLinks().then((count) => {
        rtm.sendMessage(`Total links saved: ${count}`, channel);
      });
    */
  }
}

module.exports = TotalCommand;
