const assert = require('assert');
const { activeBots } = require('../modules/botStorage');
const mongo = require('../modules/mongo');

async function getData(teamId, amount, isLatest) {
  const db = await mongo.connect();
  const results = await db.collection('Links')
    .find({ teamId })
    .sort({ createdAt: isLatest ? -1 : 1 })
    .limit(amount)
    .toArray();
  return results.reduce((acc, current, i) => `${acc}${i+1}. ${current.href}\n`, '');
}

const oldestIndicatorsRegExp = /oldest|first/;

module.exports = {
  handle(message) {
    const { teamId, channelId } = message;
    const bot = activeBots.get(teamId);
    assert(bot);
    const lowerCaseMessage = message.getContent().toLowerCase();
    const amountMatch = lowerCaseMessage.match(/\s\d{1,}(\s)?/);
    let amount = amountMatch === null ? 10 : parseInt(amountMatch[0], 10);
    if (oldestIndicatorsRegExp.test(lowerCaseMessage)) {
      return getData(teamId, amount, false).then(results => bot.rtm.sendMessage(results || 'Not found', channelId));
    } else {
      return getData(teamId, amount, true).then(results => bot.rtm.sendMessage(results || 'Not found', channelId));
    }
  }
}
