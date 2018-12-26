const assert = require('assert');
const { activeBots } = require('../modules/botStorage');
const mongo = require('./../modules/mongo');

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
    chatMessagesWithLinks = await slackChannel.fetchMessages();
  } catch (e) {
    console.error(e);
    return bot.rtm.sendMessage('I am unable to scan this channel.', channelId);
  }
  const db = await mongo.connect();
  if (chatMessagesWithLinks.length) {
    const batch = db.collection('Links').initializeOrderedBulkOp();
    for (const chatMessage of chatMessagesWithLinks) {
      for (const link of chatMessage.getLinks()) {
        batch.find({ href: link.href, 'channel.id': channelId }).upsert().updateOne({
          $setOnInsert: {
            href: link.href,
            caption: link.caption,
            author: chatMessage.author,
            channel: {
              id: channelId,
              name: slackChannel.name
            },
            createdAt: new Date()
          }
        });
        if (!chatMessage.isMarked()) {
          bot.react(chatMessage);
        }
      }
    }
    batch.execute();
    const endTime = process.hrtime(startTime);
    if (options.replyOnFinish) {
      bot.rtm.sendMessage(`Scanning complete in ${endTime[0]}s`, channelId);
    }
  }
  return undefined;
}

module.exports = {
  handle
};
