const assert = require('assert');
const { WebClient, RtmClient, CLIENT_EVENTS } = require('@slack/client');
const { slack_token } = require('../modules/configuration.js');

assert(slack_token, 'STARBOT_SLACK_TOKEN was not provided');

module.exports = {
  rtm: new RtmClient(slack_token),
  web: new WebClient(slack_token),
  EVENTS: CLIENT_EVENTS
};
