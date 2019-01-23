const assert = require('assert');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const { NODE_ENV, USE_PROXY, CLIENT_ID, PORT } = require('./modules/configuration.js');
const BotEntity = require('./entities/bot.js');
const Bot = require('./bot/modules/bot.js');
const botStorage = require('./bot/modules/botStorage.js');

const validation = require('./modules/validation.js');
const mongo = require('./modules/mongo.js');
const passport = require('./modules/passport.js');

const { generateState, authorize } = require('./middleware/auth.js');
const errorHandler = require('./middleware/error-handler.js');
const sessionMiddleware = require('./middleware/session.js');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// hot reload
if (NODE_ENV === 'development') {
  const config = require('../webpack.config.dev.js');
  const webpack = require('webpack');
  const compiler = webpack(config);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    stats: {
      assets: false,
			colors: true,
			version: false,
			hash: false,
			timings: false,
			chunks: false,
			chunkModules: false
    }
  }));
  app.use(require('webpack-hot-middleware')(compiler));
	app.use(express.static(path.resolve(__dirname, 'web')));
} else if (NODE_ENV === 'production') {
  if (USE_PROXY === true) {
    app.set('trust proxy', 1);
  }
  app.use('/', express.static(path.join(__dirname, '../dist/')));
}

import React from 'react';
import RootPage from './web/views/RootPage.jsx';
const { renderToString } = require('react-dom/server');
const template = require('./web/template.js');

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  const initialState = {
    NODE_ENV
  };
  const appString = renderToString(<RootPage {...initialState} />);
  const response = template({
    body: appString,
    title: 'Starbot Dashboard',
    initialState: JSON.stringify(initialState)
  });
  res.send(response);
});

app.get('/auth/slack/bot', (req, res, next) => {
  const state = generateState();
  return res.redirect(`https://slack.com/oauth/authorize?client_id=${CLIENT_ID}&scope=bot,channels:history,groups:history,im:history,mpim:history&state=${state}`);
});
/**
  { ok: true,
  access_token: 'xoxp-',
  scope: 'identify,bot,channels:history,groups:history,im:history,mpim:history,reactions:read,reactions:write',
  user_id: '',
  team_name: '',
  team_id: '',
  bot:
   { bot_user_id: '',
     bot_access_token: 'xoxb-' } }
 */
app.get('/auth/slack/bot/callback', authorize, async (req, res, next) => {
  if (!req.auth) return next();
  try {
    validation.auth.validate(req.auth);
    const { team_id } = req.auth; // eslint-disable-line
    if (botStorage.activeBots.has(team_id)) {
      botStorage.activeBots.get(team_id).shutdown();
      botStorage.activeBots.delete(team_id);
    }
    const bot = new Bot(req.auth);
    assert(team_id, 'botData must have team_id');
    botStorage.activeBots.set(team_id, bot);
    bot.start();
    await BotEntity.save(bot);
    // TODO: put the user in session and redirect to the dashboard
    return res.redirect('/dashboard');
  } catch (e) {
    next(e);
  }
});

app.get('/auth/dashboard', passport.authorize('slack'));
app.get('/auth/dashboard/callback', (req, res, next) => {
  passport.authenticate('slack', (err, user, info) => {
    req.login(user, (err) => {
      if (err) {
        return res.redirect('/auth/error');
      }
      res.redirect('/dashboard');
    });
  })(req, res, next);
});
app.get('/dashboard', (req, res) => { res.status(200).json('OK'); });

app.use(errorHandler);

async function startExistingBots(db) {
  const existingBots = await db.collection('Bot').find({}).toArray();
  for (const botData of existingBots) {
    const bot = new Bot(botData);
    const { teamId } = botData;
    assert(teamId, 'botData must have teamId');
    botStorage.activeBots.set(teamId, bot);
    bot.start();
  }
};

app.listen(PORT, async () => {
  console.log(`Server is up on port ${PORT}`);
  try {
    await mongo.connect().then((db) => {
      if (NODE_ENV === 'production') {
        startExistingBots(db);
      }
    });
    console.log('Connected to the database');
  } catch (e) {
    console.error('Failed to connect to the database', e);
  }
});

function shutdown() {
  botStorage.shutdown();
  mongo.disconnect();
  process.exit(0);
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
