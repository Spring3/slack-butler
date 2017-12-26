require('dotenv').load({ silent: true });

const configuration = {
  port: process.env.STARBOT_PORT || 3000,
  slack_token: process.env.STARBOT_SLACK_TOKEN,
  mongodb_uri: process.env.STARBOT_MONGODB_URI,
  blacklist: process.env.STARBOT_BLACKLIST,
  autoscan: process.env.STARBOT_AUTO_SCAN === 'true',
  scan_trigger: process.env.STARBOT_SCAN_TRIGGER,
};

module.exports = configuration;
