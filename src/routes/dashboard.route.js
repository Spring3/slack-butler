const express = require('express');
const validate = require('express-validation');
const ogs = require('open-graph-scraper');
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
      favorite,
      offset
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

    let results = await cursor.toArray();
    results = await Promise.all(results.map(async item => {
      try {
        const { data, success } = await ogs({
          url: item.href,
          encoding: 'utf8',
          headers: { 'accept-language': 'en' }
        });
        if (success) {
          return { ...item, ogp: data };
        }
      } catch (e) {
        console.error(`Error during OGP data fetching from url ${item.href}`, e.message);
      }
      return item;
    }));
    return res.send(results);
  }
);

module.exports = router;
