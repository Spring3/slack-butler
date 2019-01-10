require('dotenv').load({ silent: true });
const assert = require('assert');
const express = require('express');
const path = require('path');
const React = require('react');
const { renderToString } = require('react-dom/server');

const bodyParser = require('body-parser');
const helmet = require('helmet');

const BotEntity = require('./entities/bot.js');
const Bot = require('./modules/bot.js');

import RootPage from './web/views/RootPage.jsx';
const template = require('./web/template.js');

const botStorage = require('./modules/botStorage.js');
const validation = require('./modules/validation.js');
const { generateState, authorize } = require('./middleware/auth.js');
const errorHandler = require('./middleware/error-handler.js');
const mongo = require('./modules/mongo');

assert(process.env.CLIENT_ID, 'CLIENT_ID is undefined');
assert(process.env.CLIENT_SECRET, 'CLIENT_SECRET is undefined');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/assets', express.static(path.join(__dirname, '../dist/')));

app.get('/', (req, res) => {
  const state = generateState();
  const initialState = {
    state,
    clientId: process.env.CLIENT_ID,
    NODE_ENV: process.env.NODE_ENV
  };
  const appString = renderToString(<RootPage {...initialState} />);
  const response = template({
    body: appString,
    title: 'Starbot Dashboard',
    initialState: JSON.stringify(initialState)
  });
  res.send(response);
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
app.get('/auth/slack', authorize, async (req, res, next) => {
  if (!req.auth) return next();
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
  return res.redirect('/');
});

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

app.listen(process.env.PORT || 3000, async () => {
  console.log(`Server is up on port ${process.env.PORT || 3000}`);
  try {
    await mongo.connect(); // .then(startExistingBots);
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
