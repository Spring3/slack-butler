const request = require('request-promise-native');
const crypto = require('crypto');
const errors = require('../utils/errors.js');

const TEN_MINUTES_MS = 600000;
const cache = {};

function generateState(req, res, next) {
  const state = crypto.randomBytes(20).toString('hex');
  cache[state] = false;
  // kind of for security check that it was authorized via our server
  setTimeout(() => { delete cache[state]; }, TEN_MINUTES_MS);
  req.state = state;
  req.client_id = process.env.CLIENT_ID;
  return next();
}

async function authorize(req, res, next) {
  const { code, state, error } = req.query;

  if (error) return next(error);
  if (!code) return next(errors.badRequest('Undefined code'));
  // cache[state] = true when used
  if (cache[state] === true) {
    return next(errors.badRequest('Unknown request origin'));
  }

  cache[state] = true;
  const response = await request({
    uri: 'https://slack.com/api/oauth.access',
    qs: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
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

module.exports = {
  generateState,
  authorize
};
