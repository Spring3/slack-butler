const assert = require('assert');
const { activeBots } = require('../modules/botStorage.js');
const { version } = require('../../../package.json');

module.exports = {
  handle({ teamId, channelId }) {
    // move to the prototype
    const bot = activeBots.get(teamId);
    assert(bot);
    bot.rtm.sendMessage(version, channelId);
  }
};
