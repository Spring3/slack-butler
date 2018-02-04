const app = require('express')();
const { port, appId, appSecret } = require('./src/modules/configuration.js');
const request = require('request-promise-native');
const { Bot } = require('./src/modules/bot.js');
const mongo = require('./src/modules/mongo');
const crypto = require('crypto');
const Team = require('./src/modules/team.js');
const TeamEntity = require('./src/entities/team.js');

const cache = {};

const activeBots = {};

(async () => {
  await mongo.connect();
  Bot.start();

  app.get('/', (req, res) => {
    const state = crypto.randomBytes(64).toString('hex');
    cache[state] = true;
    setTimeout(() => {
      console.log(state);
      delete cache[state];
    }, 600000);
    res.write(`<a href="https://slack.com/oauth/authorize?client_id=298198096945.298647920563&scope=bot,channels:history,groups:history,im:history,mpim:history,reactions:read,reactions:write&state=${state}"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>`); // eslint-disable-line
  });

  app.get('/auth/slack', async (req, res) => {
    const { code, state, error } = req.query;
    if (!error && cache[state]) {
      const response = await request({
        uri: 'https://slack.com/api/oauth.access',
        qs: {
          client_id: appId,
          client_secret: appSecret,
          code
        },
        json: true
      });
      let team = await TeamEntity.get(response.team_id);
      if (!team) {
        team = new Team(response);
        await TeamEntity.save(team);
      }
      let bot = activeBots[team.id];
      if (!bot) {
        bot = new Bot(team);
        bot.start();
        activeBots[team.id] = bot;
      }
      console.log(response);
      delete cache[state];
      return res.redirect('/');
    }
    if (error) {
      console.error(error);
      return res.redirect('/');
    }
    return res.write('Error: Unknown request origin');
  });

  app.listen(port, () => {
    console.log(`Listening to port ${port}`);
  });
})();

function shutdown() {
  Bot.shutdown();
  mongo.close();
  process.exit(0);
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
