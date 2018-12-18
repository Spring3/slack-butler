const assert = require('assert');
const { activeBots } = require('../modules/botFactory');

module.exports = {
  handle({ channelId, teamId }) {
    const bot = activeBots.get(teamId);
    assert(bot);
    bot.rtm.sendMessage('[Not implemented] Blacklist values will be printed here', channelId);
  }
};
