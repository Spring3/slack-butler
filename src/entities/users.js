const mongo = require('../modules/mongo');

module.exports = {
  save: async (data) => {
    const db = await mongo.connect();
    return db.collection('Users').updateOne({
      id: data.id,
      teamId: data.teamId
    }, {
      $set: {
        name: data.name,
        avatar: data.avatar,
        updatedAt: new Date()
      },
      $setOnInsert: {
        createdAt: new Date()
      }
    }, {
      upsert: true
    });
  }
};
