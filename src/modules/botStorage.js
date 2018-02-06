const activeBots = new Map();

module.exports = activeBots;
module.exports.shutdown = () => {
  for (const botInstance of activeBots.values()) {
    botInstance.shutdown();
  }
};
