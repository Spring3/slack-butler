const activeBots = new Map();

module.exports = {
  get activeBots() {
    return activeBots;
  },
  shutdown () {
    for (const bot of activeBots.values()) {
      bot.shutdown();
    }
  }
};
