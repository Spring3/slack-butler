const AbstractCommand = require('./abstractCommand');
const db = require('./../../services/mongo').instance;
const links = db.collection('Links');

class TotalCommand extends AbstractCommand {
  constructor(rtm, chatMessage) {
    super(rtm, chatMessage);
  }

  async handle(message, channel) {
    super.handle(message, channel);
    const count = await links.count();
    this.rtm.sendMessage(`Total links: ${count}`, channel);
  }
}

module.exports = TotalCommand;
