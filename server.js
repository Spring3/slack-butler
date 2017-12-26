require('dotenv').load({ silent: true });
const app = require('express')();
const { Bot } = require('./src/modules/bot.js');
const mongo = require('./src/modules/mongo');

(async () => {
  await mongo.connect();
  Bot.start();

  app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening to port ${process.env.PORT || 3000}`);
  });
})();
