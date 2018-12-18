const mongodb = require('../modules/mongo.js');

async function save(bot) {
  const db = await mongodb.connect();
  return db.collection('Bot').update(
    { _id: bot.id },
    {
      $set: {
        scopes: bot.scopes,
        updatedAt: new Date()
      },
      $setOnInsert: {
        _id: bot.id,
        teamId: bot.team,
        enabled: true,
        token: bot.token,
        createdAt: new Date()
      }
    },
    { upsert: true }
  );
}

module.exports = {
  save
};
