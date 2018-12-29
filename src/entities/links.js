const mongo = require('../modules/mongo.js');

module.exports = {
  save: async (data = []) => {
    const links = Array.isArray(data) ? data : [data];
    const db = await mongo.connect();
    if (links.length > 0) {
      const bulk = db.collection('Links').initializeUnorderedBulkOp();
      for (const link of links) {
        bulk.find({
          href: link.href,
          teamId: link.teamId
        })
        .upsert()
        .updateOne({
          $set: { updatedAt: new Date() },
          $inc: { mentioned: 1 },
          $setOnInsert: {
            href: link.href,
            caption: link.caption,
            domain: link.domain,
            channel: link.channel,
            teamId: link.teamId,
            author: link.author,
            createdAt: new Date()
          },
        });
      }
      return bulk.execute();
    }
  }
};
