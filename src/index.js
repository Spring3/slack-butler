require('dotenv').load({ silent: true });
const assert = require('assert');
const app = require('express')();
const bodyParser = require('body-parser');
const helmet = require('helmet');

const botStorage = require('./modules/botStorage.js');
const validation = require('./modules/validation.js');
const rootHandler = require('./routes/root.js');
const { generateState, authorize } = require('./middleware/auth.js');
const errorHandler = require('./middleware/error-handler.js');
const Bot = require('./modules/bot.js');
const mongo = require('./modules/mongo');

assert(process.env.CLIENT_ID, 'CLIENT_ID is undefined');
assert(process.env.CLIENT_SECRET, 'CLIENT_SECRET is undefined');

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', generateState, rootHandler);
app.get('/auth/slack', authorize, async (req, res, next) => {
  if (!req.auth) return next();
  validation.auth.validate(req.auth);
  const { team_id } = req.auth; // eslint-disable-line
  if (!botStorage.has(team_id)) {
    const bot = new Bot(req.auth);
    botStorage.set(team_id, bot);
    bot.start();
  }
  return res.redirect('/');
});

app.use(errorHandler);

app.listen(process.env.PORT || 3000, async () => {
  console.log(`Server is up on port ${process.env.PORT || 3000}`);
  try {
    await mongo.connect();
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
