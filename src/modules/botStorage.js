const activeBots = new Map();

module.exports = activeBots;
module.exports.shutdown = () => {
  for (const bot of activeBots.values()) {
    bot.shutdown();
  }
};
