const assert = require('assert');
const { WebClient, RtmClient, CLIENT_EVENTS } = require('@slack/client');
const { slack_bot_token, slack_user_token } = require('../modules/configuration.js');

assert(slack_bot_token, 'STARBOT_SLACK_BOT_TOKEN was not provided');

module.exports = {
  rtm: new RtmClient(slack_bot_token),
  web: new WebClient(slack_bot_token),
  EVENTS: CLIENT_EVENTS
};
