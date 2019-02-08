const express = require('express');
const validate = require('express-validation');
const { isAuthenticated } = require('../middlewares/auth.js');
const validation = require('../utils/validation');
const mongo = require('../modules/mongo.js');

const router = new express.Router();

router.get(
  '/links',
  isAuthenticated,
  validate(validation.dashboardLinks),
  async (req, res) => {
    const {
      sort,
      batchSize,
      author,
      favorite
    } = req.query;
    const db = await mongo.connect();
    const collection = favorite === true ? 'Highlights' : 'Links';
    const query = { teamId: req.user.team.id };
    if (author) {
      query.author = author;
    }
    const cursor = db.collection(collection).find(query).project({
      author: 1,
      href: 1,
      channel: 1,
      createdAt: 1
    });
    if (sort) {
      const sorting = {};
      for (const entryString of sort) {
        const entry = entryString.split(':');
        sorting[entry[0]] = entry[1] === 'true';
      }
      cursor.sort(sorting);
    }
    if (batchSize) {
      cursor.limit(batchSize);
    }
    const results = await cursor.toArray();
    return res.send(results);
  }
);

module.exports = router;
