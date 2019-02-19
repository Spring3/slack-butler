const mongo = require('../modules/mongo.js');

module.exports = {
  save: async (data) => {
    const db = await mongo.connect();
    const dataArray = Array.isArray(data) ? data : [data];
    if (dataArray.length) {
      const bulk = db.collection('Highlights').initializeUnorderedBulkOp();
      for (const highlight of dataArray) {
        bulk.find({ _id: highlight._id }).upsert().updateOne({ $setOnInsert: highlight });
      }
      return bulk.execute();
    }
  },
  remove: async (ids) => {
    if (!ids) return undefined;
    const idsArray = Array.isArray(ids) ? ids : [ids];
    const db = await mongo.connect();
    return db.collection('Highlights').deleteOne({ _id: { $in: idsArray } });
  }
};
