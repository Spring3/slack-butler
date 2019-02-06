const request = require('request-promise-native');
const crypto = require('crypto');
const { CLIENT_ID, CLIENT_SECRET } = require('../modules/configuration.js');
const errors = require('../utils/errors');

const TEN_MINUTES_MS = 600000;
const cache = {};

function generateState() {
  const state = crypto.randomBytes(20).toString('hex');
  cache[state] = false;
  // kind of for security check that it was authorized via our server
  setTimeout(() => { delete cache[state]; }, TEN_MINUTES_MS);
  return state;
}

async function authorize(req, res, next) {
  const { code, state, error } = req.query;

  if (error) return next(error);
  if (!code) return next(errors.badRequest('Undefined code'));
  // cache[state] = true when used
  if (cache[state] === true) {
    return next(errors.badRequest('State ttl expired or the state check failed.'));
  }

  cache[state] = true;
  const response = await request({
    uri: 'https://slack.com/api/oauth.access',
    qs: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code
    },
    json: true
  });

  if (!response.ok) {
    return next(response.error);
  }
  req.auth = response;
  return next();
}

function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next(errors.unAuthorized());
  }
  return next();
}

module.exports = {
  generateState,
  authorize,
  isAuthenticated
};
