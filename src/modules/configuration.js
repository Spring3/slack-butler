const assert = require('assert');
require('dotenv').load({ silent: true });

const SECOND = 1000;
const TWICE_A_DAY = 43200 * SECOND;

const configuration = {
  appId: process.env.APP_ID,
  appSecret: process.env.APP_SECRET,
  appValidation: process.env.APP_VALIDATION,
  port: process.env.PORT || 3000,
  mongodbUri: process.env.STARBOT_MONGODB_URI,
  autoScanInterval: process.env.STARBOT_AUTO_SCAN_INTERVAL || TWICE_A_DAY,
  scanTriggerEmoji: process.env.STARBOT_SCAN_TRIGGER_EMOJI || 'star',
  reactionEmoji: process.env.STARBOT_REACTION_EMOJI || 'star',
  favoritesReactionEmoji: process.env.STARBOT_FAVORITES_REACTION_EMOJI || 'star'
};

assert(configuration.appId, 'APP_ID is undefined');
assert(configuration.appSecret, 'APP_SECRET is undefined');

module.exports = configuration;
