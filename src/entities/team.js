const assert = require('assert');
const mongo = require('../modules/mongo.js');
const Team = require('../modules/team.js');

async function get(id) {
  try {
    assert(id);
    const db = await mongo.connect();
    const res = db.collection('Team').findOne({ _id: id });
    if (!res) return null;
    return new Team({
      access_token: res.accessToken,
      scope: res.scope,
      team_name: res.name,
      team_id: res._id, // eslint-disable-line
      bot: {
        bot_user_id: res.bot.id,
        bot_access_token: res.bot.token
      }
    });
  } catch (e) {
    console.log('Error when attempting to retrieve a team:');
    console.error(e);
    return undefined;
  }
}

async function save(team) {
  try {
    const db = await mongo.connect();
    return db.collection('Team').insert({
      _id: team.id,
      name: team.name,
      accessToken: team.accessToken,
      scope: team.scope,
      bot: team.bot,
      createdAt: team.createdAt
    });
  } catch (e) {
    console.log('Error when attempting to create a team:');
    console.error(e);
    return undefined;
  }
}


module.exports = {
  get,
  save
};
