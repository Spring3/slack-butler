require('dotenv').load({ silent: true });
const express = require('express');
const path = require('path');
const app = express();
const mongo = require('./services/mongo');
const publicPath = `${__dirname}/static`;

app.use(express.static(publicPath));

async function start() {
  const db = await mongo();
  require('./services/bot').start();

  app.get('/', (req, res) => {
    res.sendFile(path.join(`${publicPath}/index.html`));
  });

  app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening to port ${process.env.PORT || 3000}`);
  });
}

start();
