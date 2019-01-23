const assert = require('assert');
const { activeBots } = require('../modules/botStorage.js');
const mongo = require('../../modules/mongo.js');

function isValidRegex(str) {
  if (!str) return false;
  try {
    new RegExp(str); // eslint-disable-line no-new
    return true;
  } catch (e) {
    return false;
  }
}

async function handle(message) {
  // move this out to the base class (prototype)
  const { teamId, channelId } = message;
  const bot = activeBots.get(teamId);
  assert(bot);
  const lowerCaseMessage = message.getContent().toLowerCase();
  const messageParts = lowerCaseMessage.split(' ');
  // 0 is the command name itself. eg. "search <value>"
  if (isValidRegex(messageParts[1])) {
    const regexp = new RegExp(messageParts[1], 'gi');
    const db = await mongo.connect();
    const hrefs = await db.collection('Links')
      .find({ href: regexp, teamId })
      .project({ href: 1, _id: 0 })
      .toArray();
    const resultString = hrefs.reduce((sum, curr, i) => `${sum}${i + 1}. ${curr.href}\n`, '');
    bot.rtm.sendMessage(`${resultString || 'Not found'}`, channelId);
    return;
  } else {
    bot.rtm.sendMessage('Unable to process such command', channelId);
    return;
  }
};


module.exports = {
  handle
};
