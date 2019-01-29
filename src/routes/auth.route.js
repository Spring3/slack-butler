const express = require('express');
const assert = require('assert');
const validate = require('express-validation');
const { CLIENT_ID } = require('../modules/configuration.js');
const { generateState, authorize } = require('../middlewares/auth.js');
const BotEntity = require('../entities/bot.js');
const Bot = require('../bot/modules/bot.js');
const botStorage = require('../bot/modules/botStorage.js');
const passport = require('../modules/passport.js');
const validation = require('../modules/validation.js');

const router = express.Router();

router.get('/slack/bot', (req, res) => {
  const state = generateState();
  return res.redirect(
    `https://slack.com/oauth/authorize?client_id=${CLIENT_ID}&scope=bot,channels:history,groups:history,im:history,mpim:history&state=${state}`
  );
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
router.get('/slack/bot/callback',
  validate(validation.slackBotCallbackRaw),
  authorize,
  validate(validation.slackBotCallbackModified),
  async (req, res) => {
    const { team_id } = req.auth;
    if (botStorage.activeBots.has(team_id)) {
      botStorage.activeBots.get(team_id).shutdown();
      botStorage.activeBots.delete(team_id);
    }
    const bot = new Bot(req.auth);
    assert(team_id, 'botData must have team_id property');
    botStorage.activeBots.set(team_id, bot);
    bot.start();
    await BotEntity.save(bot);
    return res.redirect('/dashboard');
  });

router.get('/dashboard', passport.authorize('slack'));

router.get('/dashboard/callback', (req, res, next) => {
  passport.authenticate('slack', (error, user) => {
    if (error) return next(error);
    return req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});

// TODO: support client-side
router.get('/error', (req, res) => {
  res.send(400).json('Something went wrong');
});

module.exports = router;
