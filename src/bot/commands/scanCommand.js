const assert = require('assert');
const { activeBots } = require('../modules/botStorage.js');
const mongo = require('../../modules/mongo.js');
const urlUtils = require('../utils/url');

/**
 * Command to run a scan of the channel for new links
 */
async function handle({ channelId, teamId }, options = {}) {
  // move this out to the base class (prototype)
  const bot = activeBots.get(teamId);
  assert(bot);
  const startTime = process.hrtime();
  const slackChannel = bot.channels.get(channelId);
  // getting only messages with links from the channel
  let chatMessagesWithLinks;
  try {
    chatMessagesWithLinks = await slackChannel.fetchMessages(bot);
  } catch (e) {
    console.error(e);
    return bot.rtm.sendMessage('I am unable to scan this channel.', channelId);
  }
  const db = await mongo.connect();
  if (chatMessagesWithLinks.length) {
    const batch = db.collection('Links').initializeOrderedBulkOp();
    for (const chatMessage of chatMessagesWithLinks) {
      const ogpData = await urlUtils.forManyAsync(chatMessage.getLinks(), urlUtils.fetchOGP);
      for (const { href, ogp } of ogpData) {
        batch.find({ href, 'channel.id': channelId }).upsert().updateOne({
          $setOnInsert: {
            href,
            author: chatMessage.author,
            ogp,
            channel: {
              id: channelId,
              name: slackChannel.name
            },
            teamId,
            createdAt: new Date()
          }
        });
        if (!chatMessage.isMarked()) {
          bot.react(chatMessage);
        }
      }
    }
    await batch.execute();
  }
  const endTime = process.hrtime(startTime);
  if (options.replyOnFinish) {
    bot.rtm.sendMessage(`Scanning complete in ${endTime[0]}s`, channelId);
  }
  return undefined;
}

module.exports = {
  handle
};
