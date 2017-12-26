const app = require('express')();
const { port } = require('./src/modules/configuration.js');
const { Bot } = require('./src/modules/bot.js');
const mongo = require('./src/modules/mongo');

(async () => {
  await mongo.connect();
  Bot.start();

  app.listen(port, () => {
    console.log(`Listening to port ${port}`);
  });
})();
