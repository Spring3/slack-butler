const mongodb = require('../modules/mongo.js');

async function save(bot) {
  const db = await mongodb.connect();
  return db.collection('Bot').updateOne(
    {
      slackId: bot.id
    },
    {
      $set: {
        userToken: bot.userToken,
        teamId: bot.teamId,
        scopes: bot.scopes,
        token: bot.token,
        updatedAt: new Date()
      },
      $setOnInsert: {
        slackId: bot.id,
        createdAt: new Date()
      }
    },
    { upsert: true }
  );
}

module.exports = {
  save
};
