require('dotenv').load({ silent: true });

const ONE_SECOND_MS = 1000;
const TWICE_A_DAY_MS = 43200 * ONE_SECOND_MS;

const configuration = {
  autoScanInterval: process.env.STARBOT_AUTO_SCAN_INTERVAL || TWICE_A_DAY_MS,
  botReactionEmoji: process.env.BOT_REACTION_EMOJI || 'star',
  favoritesTriggerEmoji: process.env.USER_FAVORITES_TRIGGER_EMOJI || 'star'
};

module.exports = configuration;
