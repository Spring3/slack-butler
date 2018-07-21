const mongodb = require('../modules/mongo.js');

function save(bot) {
  return mongodb.connect().then(db =>
    db.collection('Bot').update(
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
    ));
}

module.exports = {
  save
};
