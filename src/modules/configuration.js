require('dotenv').load({ silent: true });

const SECOND = 1000;
const TWICE_A_DAY = 43200 * SECOND;

const configuration = {
  appValidation: process.env.APP_VALIDATION,
  autoScanInterval: process.env.STARBOT_AUTO_SCAN_INTERVAL || TWICE_A_DAY,
  scanTriggerEmoji: process.env.STARBOT_SCAN_TRIGGER_EMOJI || 'star',
  reactionEmoji: process.env.STARBOT_REACTION_EMOJI || 'star',
  favoritesReactionEmoji: process.env.STARBOT_FAVORITES_REACTION_EMOJI || 'star'
};

module.exports = configuration;
