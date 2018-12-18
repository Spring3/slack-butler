const assert = require('assert');
const Bot = require('./bot.js');
const activeBots = new Map();

module.exports = {
  get activeBots() {
    return activeBots;
  },
  create (botData) {
    const bot = new Bot(botData);
    const { team_id } = botData;
    assert(team_id, 'botData must have team_id');
    activeBots.set(team_id, botData);
    return bot;
  },
  shutdown () {
    for (const bot of activeBots.values()) {
      bot.shutdown();
    }
  }
};
