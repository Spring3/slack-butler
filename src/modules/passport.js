require('dotenv').load({ silent: true });
const crypto = require('crypto');
const passport = require('passport');
const SlackStrategy = require('passport-slack').Strategy;

passport.use(new SlackStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  scope: ['identity.basic', 'identity.avatar', 'identity.team'],
  state: crypto.randomBytes(20).toString('hex')
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile);
}));

passport.serializeUser((user, done) => {
  console.log('serializeUser', user);
  const sessionUser = {
    id: user.id,
    name: user.name,
    avatar: user.user.image_512,
    team: {
      id: user.team.id,
      name: user.team.name,
      avatar: user.team.image_230
    }
  };
  return done(null, sessionUser);
});

passport.deserializeUser((sessionUser, done) => done(sessionUser));

module.exports = passport;
