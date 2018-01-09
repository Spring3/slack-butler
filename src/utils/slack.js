const assert = require('assert');
const { WebClient, RtmClient, CLIENT_EVENTS } = require('@slack/client');
const { slackBotToken, slackUserToken } = require('../modules/configuration.js');

assert(slackBotToken, 'STARBOT_SLACK_BOT_TOKEN was not provided');

module.exports = {
  rtm: new RtmClient(slackBotToken),
  userWeb: new WebClient(slackUserToken),
  web: new WebClient(slackBotToken),
  EVENTS: CLIENT_EVENTS
};
