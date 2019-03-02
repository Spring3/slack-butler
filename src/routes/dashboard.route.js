const express = require('express');
const validate = require('express-validation');
const { isAuthenticated } = require('../middlewares/auth.js');
const validation = require('../utils/validation');
const mongo = require('../modules/mongo.js');
const helper = require('../utils/dashboard.route.helper.js');

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
      favorite,
      offset
    } = req.query;
    const db = await mongo.connect();

    let cursor;

    if (favorite !== true) {
      cursor = db.collection('Links').aggregate(helper.prepareLinksAggregation(req.user.team.id, author));
    } else {
      cursor = db.getCollection('Highlights').aggregate(helper.prepareHighlightsAggregation(req.user.team.id, author, req.user.id));
    }

    if (offset) {
      cursor.skip(offset);
    }

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
