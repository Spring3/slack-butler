const Joi = require('joi');

module.exports = {
  slackBotCallbackRaw: {
    query: {
      code: Joi.string().required(),
      state: Joi.string().alphanum().required(),
      error: Joi.string().allow('')
    }
  },
  slackBotCallbackModified: {
    auth: {
      access_token: Joi.string().required(),
      scope: Joi.string().required(),
      team_name: Joi.string().required(),
      team_id: Joi.string().required(),
      bot: Joi.object().keys({
        bot_user_id: Joi.string().required(),
        bot_access_token: Joi.string().required()
      }).required(),
      createdAt: Joi.date().default(Date.now())
    }
  },
  dashboardLinks: {
    query: {
      sort: Joi.array().items(Joi.string()),
      batchSize: Joi.number().default(10),
      author: Joi.string(),
      channel: Joi.string(),
      favorite: Joi.boolean()
    }
  }
};
