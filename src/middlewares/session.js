require('dotenv').load({ silent: true });
const uuid = require('uuid');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const MongodbStore = require('connect-mongodb-session')(session);
const { SESSION_SECRET, REDIS_URL, REDIS_PREFIX, MONGODB_URI, USE_HTTPS } = require('../modules/configuration.js');

const ONE_WEEK_MS = 7 * 24 * 3600 * 1000;

const sessionConfig = {
  genid: () => uuid.v4(),
  secret: SESSION_SECRET,
  cookie: {
    httpOnly: false,
    maxAge: ONE_WEEK_MS
  },
  resave: false,
  saveUninitialized: false
};

sessionConfig.cookie.secure = USE_HTTPS;
if (REDIS_URL) {
  sessionConfig.store = new RedisStore({
    url: REDIS_URL,
    prefix: REDIS_PREFIX
  });
} else {
  sessionConfig.store = new MongodbStore({
    uri: MONGODB_URI,
    collection: 'StarbotSession'
  });
}

module.exports = session(sessionConfig);
