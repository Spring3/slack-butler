const mongo = require('../mongo.js');
const Command = require('./command.js');

class PrintCommand extends Command {
  constructor(chatMessage) {
    super(chatMessage);
  }

  isValidRegex(str) {
    if (!str) return false;
    try {
      new RegExp(str.trim().toLowerCase()); // eslint-disable-line no-new
      return true;
    } catch (e) {
      return false;
    }
  }

  async handle(message, channel) {
    const db = await mongo.connect();
    const lowerCaseMessage = message.trim().toLowerCase();
    const amongFavorite = lowerCaseMessage.includes('favorite');
    const collection = amongFavorite ? 'Highlights' : 'Links';
    const messageParts = lowerCaseMessage.split(' ');
    let limit = parseInt(messageParts[2], 10);
    limit = Number.isNaN(limit) ? 5 : limit;
    let results = [];
    if (['top', 'last', 'latest', 'newest'].includes(messageParts[1])) {
      results = await db.collection(collection)
        .find({}, { href: 1 })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
    } else if (this.isValidRegex(messageParts[1])) {
      const regex = new RegExp(messageParts[1], 'g');
      results = await db.collection(collection)
        .find({ href: regex }, { href: 1 })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
    } else {
      this.rtm.sendMessage('Unable to process such command', channel);
      return;
    }
    const resultString = results.reduce((sum, cur, i) => `${sum}${i + 1}. ${cur.href}\n`, '');
    this.rtm.sendMessage(`${resultString}`, channel);
  }
}


module.exports = PrintCommand;
