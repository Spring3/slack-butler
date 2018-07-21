const mongo = require('../modules/mongo.js');

module.exports = {
  saveAll: async (data) => {
    const db = await mongo.connect();
    return db.collection('Highlights').insertMany(data);
  }
};
