require('dotenv').load({ silent: true });
const app = require('express')();
require('./services/bot').start();
const db = require('./services/db');
const mongodb = require('./services/mongodb');

db.init().then(() => {
  console.log('Connected to a database');
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening to port ${process.env.PORT || 3000}`);
  });
}).catch((e) => {
  console.error(e);
});
