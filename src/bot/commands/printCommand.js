const assert = require('assert');
const { activeBots } = require('../modules/botStorage.js');
const mongo = require('../../modules/mongo.js');

async function getData(teamId, amount, isLatest) {
  const db = await mongo.connect();
  const hrefs = await db.collection('Links')
    .find({ teamId })
    .project({ href: 1, _id: 0 })
    .sort({ createdAt: isLatest ? -1 : 1 })
    .limit(amount)
    .toArray();
  return hrefs.reduce((acc, curr, i) => `${acc}${i + 1}. ${curr.href}\n`, '');
}

const oldestIndicatorsRegExp = /oldest|first/;

module.exports = {
  handle(message) {
    const { teamId, channelId } = message;
    const bot = activeBots.get(teamId);
    assert(bot);
    const lowerCaseMessage = message.getContent().toLowerCase();
    const amountMatch = lowerCaseMessage.match(/\s\d{1,}(\s)?/);
    const amount = amountMatch === null ? 10 : parseInt(amountMatch[0], 10);
    if (oldestIndicatorsRegExp.test(lowerCaseMessage)) {
      return getData(teamId, amount, false).then(results => bot.rtm.sendMessage(results || 'Not found', channelId));
    }
    return getData(teamId, amount, true).then(results => bot.rtm.sendMessage(results || 'Not found', channelId));
  }
};
