require('dotenv').load({ silent: true });
const Joi = require('joi');
const _ = require('lodash');

const schema = Joi.object().keys({
  NODE_ENV: Joi.string().required().valid(['production', 'development', 'test']).default('development'),
  CLIENT_ID: Joi.string().required(),
  CLIENT_SECRET: Joi.string().required(),
  USING_PROXY: Joi.boolean().required().valid([true, false]).default(false),
  ENABLE_HTTPS: Joi.boolean().required().valid([true, false]).default(false),
  SESSION_SECRET: Joi.string().required(),
  REDIS_URL: Joi.string().allow(''),
  REDIS_PREFIX: Joi.string().allow('').default('starbot:'),
  MONGODB_URI: Joi.string().required(),
  AUTO_SCAN_INTERVAL_MS: Joi.number().integer(),
  BOT_REACTION_EMOJI: Joi.string().lowercase().default('star'),
  USER_FAVORITES_TRIGGER_EMOJI: Joi.string().lowercase().default('star'),
  PORT: Joi.number().integer().default(3000),
  HOST: Joi.string().required()
});

const configuration = _.pick(process.env,
  'NODE_ENV',
  'CLIENT_ID',
  'CLIENT_SECRET',
  'USING_PROXY',
  'ENABLE_HTTPS',
  'SESSION_SECRET',
  'REDIS_URL',
  'REDIS_PREFIX',
  'MONGODB_URI',
  'BOT_REACTION_EMOJI',
  'USER_FAVORITES_TRIGGER_EMOJI',
  'AUTO_SCAN_INTERVAL_MS',
  'PORT',
  'HOST');

const { error, value } = Joi.validate(configuration, schema);

if (error) {
  throw error;
}

module.exports = value;
