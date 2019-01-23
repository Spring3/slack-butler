require('dotenv').load({ silent: true });
const passport = require('passport');
const SlackStrategy = require('passport-slack-oauth2').Strategy;

passport.serializeUser((user, done) => done(null, {
  id: user.id,
  name: user.displayName,
  avatar: user.user.image_512,
  team: {
    id: user.team.id,
    name: user.team.name,
    avatar: user.team.image_230
  }
}));

passport.deserializeUser((sessionUser, done) => done(null, sessionUser));

passport.use('slack', new SlackStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  scope: [
    'identity.basic',
    'identity.avatar',
    'identity.team'
  ],
  callbackURL: '/auth/dashboard/callback'
}, (accessToken, refreshToken, profile, done) => done(null, profile)));

module.exports = passport;
