require('dotenv').load({ silent: true });

const SECOND = 1000;
const TWICE_A_DAY = 43200 * SECOND;

const configuration = {
  port: process.env.STARBOT_PORT || 3000,
  slack_bot_token: process.env.STARBOT_SLACK_BOT_TOKEN,
  mongodb_uri: process.env.STARBOT_MONGODB_URI,
  blacklist: process.env.STARBOT_BLACKLIST,
  auto_scan_interval: process.env.STARBOT_AUTO_SCAN_INTERVAL || TWICE_A_DAY,
  scan_trigger_emoji: process.env.STARBOT_SCAN_TRIGGER_EMOJI,
  reaction_emoji: process.env.STARBOT_REACTION_EMOJI || 'star'
};

module.exports = configuration;
