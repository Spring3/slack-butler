const Command = require('./command');
const mongo = require('./../mongo');

class ScanCommand extends Command {
  constructor(chatMessage) {
    super(chatMessage);
  }

  async handle(message, channel, options = {}) {
    super.handle(message, channel);
    const startTime = process.hrtime();
    let slackChannel = this.bot.channels.get(channel) || this.chatMessage.channel;
    // getting only messages with links from the channel
    const chatMessagesWithLinks = await slackChannel.getMessages();
    const messagesWithLinksCount = chatMessagesWithLinks.length;
    const db = await mongo.connect();
    if (messagesWithLinksCount) {
      const batch = db.collection('Links').initializeUnorderedBulkOp();
      for (const chatMessage of chatMessagesWithLinks) {
        for (const link of chatMessage.getLinks()) {
          batch.find({ href: link.href, 'channel.id': channel }).upsert().updateOne({
            $setOnInsert: Object.assign({}, link, {
              author: chatMessage.author,
              channel: {
                id: channel,
                name: slackChannel.name || 'DM'
              },
              createdAt: new Date()
            })
          });
          if (!chatMessage.isMarked()) {
            this.bot.react(chatMessage);
          }
        }

      }
      batch.execute();
      const endTime = process.hrtime(startTime);
      if (options.replyOnFinish) {
        this.rtm.sendMessage(`Scanning complete in ${endTime[0]}s`, channel);
      }
    }
  }
}

module.exports = ScanCommand;
