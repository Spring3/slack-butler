require('dotenv').load({ silent: true });

const SECOND = 1000;
const TWICE_A_DAY = 43200 * SECOND;

const configuration = {
  port: process.env.PORT || 3000,
  slackBotToken: process.env.STARBOT_SLACK_BOT_TOKEN,
  slackUserToken: process.env.STARBOT_SLACK_USER_TOKEN,
  mongodbUri: process.env.STARBOT_MONGODB_URI,
  blacklist: process.env.STARBOT_BLACKLIST,
  autoScanInterval: process.env.STARBOT_AUTO_SCAN_INTERVAL || TWICE_A_DAY,
  scanTriggerEmoji: process.env.STARBOT_SCAN_TRIGGER_EMOJI || 'star',
  reactionEmoji: process.env.STARBOT_REACTION_EMOJI || 'star',
  favoritesReactionEmoji: process.env.STARBOT_FAVORITES_REACTION_EMOJI || 'star'
};

module.exports = configuration;
