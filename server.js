require('dotenv').load({ silent: true });
const express = require('express');
const app = express();
const mongo = require('./services/mongo');
const path = require('path');

(async () => {
  const db = await mongo();
  // require('./services/bot').start();
  app.set('views', path.join(__dirname, 'web', 'static', 'views'));
  app.set('view engine', 'pug');
  app.use(express.static(path.join(__dirname, 'web', 'static')));
  app.get('*', (req, res) => {
    res.render('index');
  });

  app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening to port ${process.env.PORT || 3000}`);
  });
})();
