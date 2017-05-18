require('dotenv').load({ silent: true });
const app = require('express')();
const mongo = require('./services/mongo');

async function start() {
  const db = await mongo();
  require('./services/bot').start();

  app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening to port ${process.env.PORT || 3000}`);
  });
}

start();
