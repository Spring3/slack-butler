const Joi = require('joi');

const authResponseSchema = Joi.object().keys({
  access_token: Joi.string().required(),
  scope: Joi.string().required(),
  team_name: Joi.string().required(),
  team_id: Joi.string().required(),
  bot: Joi.object().keys({
    bot_user_id: Joi.string().required(),
    bot_access_token: Joi.string().required()
  }).required(),
  createdAt: Joi.date().default(Date.now())
}).required();


module.exports = {
  auth: {
    validate: data => Joi.validate(authResponseSchema, data)
  }
};
