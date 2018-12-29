const mongo = require('../modules/mongo.js');

async function upsert(team) {
  try {
    const db = await mongo.connect();
    return db.collection('Team').updateOne(
      { _id: team.id },
      {
        $set: {
          updatedAt: new Date(),
          name: team.name
        },
        $setOnInsert: {
          _id: team.id,
          bot: team.bot,
          createdAt: team.createdAt
        }
      },
      { upsert: true }
    );
  } catch (e) {
    console.error('Error when attempting to update [upsert] a team:', e);
    return null;
  }
}

module.exports = {
  upsert
};
