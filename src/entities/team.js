const assert = require('assert');
const mongo = require('../modules/mongo.js');
const Team = require('../modules/team.js');

async function getById(id) {
  try {
    assert(id);
    const db = await mongo.connect();
    // todo: cache
    const res = await db.collection('Team').findOne({ _id: id });
    if (!res) return null;
    return new Team({
      scope: res.scope,
      team_name: res.name,
      team_id: res._id, // eslint-disable-line
      bot: {
        bot_user_id: res.bot.id,
        bot_access_token: res.bot.token
      }
    });
  } catch (e) {
    console.error('Error when attempting to retrieve a team:', e);
    return null;
  }
}

async function get(query) {
  try {
    const db = await mongo.connect();
    // todo: cache
    const res = await db.collection('Team').findOne(query);
    if (!res) return null;
    return new Team({
      scope: res.scope,
      team_name: res.name,
      team_id: res._id, // eslint-disable-line
      bot: {
        bot_user_id: res.bot.id,
        bot_access_token: res.bot.token
      }
    });
  } catch (e) {
    console.error('Error when attempting to retrieve a team:', e);
    return null;
  }
}

async function save(team) {
  try {
    const db = await mongo.connect();
    return db.collection('Team').insert({
      _id: team.id,
      name: team.name,
      scope: team.scope,
      bot: team.bot,
      createdAt: team.createdAt
    });
  } catch (e) {
    console.error('Error when attempting to create a team:', e);
    return null;
  }
}

async function upsert(team) {
  try {
    const db = await mongo.connect();
    return db.collection('Team').update({
      $setOnInsert: {
        _id: team.id,
        name: team.name,
        scope: team.scope,
        bot: team.bot,
        createdAt: team.createdAt
      }
    }, { upsert: true });
  } catch (e) {
    console.error('Error when attempting to update [upsert] a team:', e);
    return null;
  }
}


module.exports = {
  get,
  getById,
  save,
  upsert
};
