const mongo = require('../modules/mongo.js');

module.exports = {
  save: async (data = []) => {
    const links = Array.isArray(data) ? data : [data];
    const db = await mongo.connect();
    if (links.length) {
      const bulk = db.collection('Links').initializeUnorderedBulkOp();
      for (const link of links) {
        bulk.find({
          href: link.href,
          teamId: link.teamId
        }).upsert()
          .updateOne({
            $set: { updatedAt: new Date() },
            $inc: { mentioned: 1 },
            $setOnInsert: {
              href: link.href,
              ogp: link.ogp,
              channel: link.channel,
              teamId: link.teamId,
              author: link.author,
              createdAt: new Date()
            },
          });
      }
      return bulk.execute();
    }
  },
  findMatchingLinkIds: (hrefs = [], teamId, mapFn) => mongo.connect()
    .then(db => db.collection('Links').find({
      href: { $in: hrefs },
      teamId
    }).project({ _id: 1 })
      .map(mapFn)
      .toArray())
};
