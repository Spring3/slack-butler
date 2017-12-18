const assert = require('assert');
const { WebClient, RtmClient, CLIENT_EVENTS } = require('@slack/client');

assert(process.env.SLACK_BOT_TOKEN, 'SLACK_BOT_TOKEN was not provided');

module.exports = {
  rtm: new RtmClient(process.env.SLACK_BOT_TOKEN),
  web: new WebClient(process.env.SLACK_BOT_TOKEN),
  EVENTS: CLIENT_EVENTS,
};
