const Command = require('./command');
const Bot = require('../bot.js');
const mongo = require('./../mongo');

/**
 * Command to run a scan of the channel for new links
 */
class ScanCommand extends Command {
  constructor(chatMessage) {
    super(chatMessage);
  }

  async handle(message, channelId, options = {}) {
    super.handle(message, channelId);
    const startTime = process.hrtime();
    const bot = Bot.getInstance();
    const slackChannel = bot.channels.has(channelId) ? bot.channels.get(channelId) : this.chatMessage.channel;
    // getting only messages with links from the channel
    let chatMessagesWithLinks;
    try {
      chatMessagesWithLinks = await slackChannel.fetchMessages();
    } catch (e) {
      console.error(e);
      return this.rtm.sendMessage('I am unable to scan this channel.', channelId);
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
        this.rtm.sendMessage(`Scanning complete in ${endTime[0]}s`, channelId);
      }
    }
    return undefined;
  }
}

module.exports = ScanCommand;
