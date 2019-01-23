require('dotenv').load({ silent: true });
const assert = require('assert');
const uuid = require('uuid');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const MongodbStore = require('connect-mongodb-session')(session);

assert(process.env.SESSION_SECRET, 'SESSION_SECRET environment variable is undefined, but is required');

const ONE_WEEK_MS = 7 * 24 * 3600 * 1000;
const THIRTY_DAYS_SECONDS = 30 * 24 * 3600;

const sessionConfig = {
  genid: () => uuid.v4(),
  secret: process.env.SESSION_SECRET,
  store: new session.MemoryStore(),
  cookie: {
    httpOnly: false,
    maxAge: ONE_WEEK_MS
  },
  resave: false,
  saveUninitialized: false
};

if (process.env.NODE_ENV === 'production') {
  sessionConfig.cookie.secure = process.env.USE_HTTPS === 'true';
  try {
    assert(process.env.REDIS_URL);
    sessionConfig.store = new RedisStore({
      url: process.env.REDIS_URL,
      db: process.env.REDIS_DB || 0,
      ttl: process.env.REDIS_TTL || THIRTY_DAYS_SECONDS,
      prefix: process.env.REDIS_PREFIX || 'starbot:'
    });
  } catch (e) {
    sessionConfig.store = new MongodbStore({
      uri: process.env.MONGODB_URI,
      collection: 'StarbotSession'
    });
  }
}

module.exports = session(sessionConfig);
