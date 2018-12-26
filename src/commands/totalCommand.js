const assert = require('assert');
const { activeBots } = require('../modules/botStorage');
const mongo = require('./../modules/mongo');

module.exports = {
  async handle({ channelId, teamId }) {
    // move this out to the base class (prototype)
    const bot = activeBots.get(teamId);
    assert(bot);
    const db = await mongo.connect();
    const [count, countInChannel] = await Promise.all([
      db.collection('Links').find({ team: teamId }).count(),
      db.collection('Links').find({ 'channel.id': channelId }).count()
    ]);
    bot.rtm.sendMessage(`Total links: ${count}\nFrom this channel: ${countInChannel}`, channelId);
  }
};
