const assert = require('assert');
const { activeBots } = require('../modules/botStorage');
const mongo = require('../modules/mongo.js');

function isValidRegex(str) {
  if (!str) return false;
  try {
    new RegExp(str.trim().toLowerCase()); // eslint-disable-line no-new
    return true;
  } catch (e) {
    return false;
  }
}

async function handle({ teamId, channelId, author, text }) {
  // move this out to the base class (prototype)
  const bot = activeBots.get(teamId);
  assert(bot);
  const db = await mongo.connect();
  const lowerCaseMessage = text.trim().toLowerCase();
  const amongFavorite = lowerCaseMessage.includes('favorite');
  const collection = amongFavorite ? 'Highlights' : 'Links';
  const messageParts = lowerCaseMessage.split(' ');
  let limit = parseInt(messageParts[2], 10);
  limit = Number.isNaN(limit) ? 5 : limit;
  let results = [];
  if (['top', 'last', 'latest', 'newest'].includes(messageParts[1])) {
    const filter = amongFavorite ? { author } : {};
    results = await db.collection(collection)
      .find(filter, { href: 1 })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  } else if (isValidRegex(messageParts[1])) {
    const regex = new RegExp(messageParts[1], 'g');
    const filter = Object.assign({ href: regex }, amongFavorite ? { author } : {});
    results = await db.collection(collection)
      .find(filter, { href: 1 })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  } else {
    bot.rtm.sendMessage('Unable to process such command', channelId);
    return;
  }
  const resultString = results.reduce((sum, cur, i) => `${sum}${i + 1}. ${cur.href}\n`, '');
  bot.rtm.sendMessage(`${resultString}`, channelId);
};


module.exports = {
  handle
};
