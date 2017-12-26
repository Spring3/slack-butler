const Command = require('./command');
const mongo = require('./../mongo');

class TotalCommand extends Command {
  constructor(chatMessage) {
    super(chatMessage);
  }

  async handle(message, channel) {
    super.handle(message, channel);
    const db = await mongo.connect();
    const count = await db.collection('Links').count();
    const inChannel = await db.collection('Links').find({ 'channel.id': channel }).count();
    this.rtm.sendMessage(`Total links: ${count}\nFrom this channel: ${inChannel}`, channel);
  }
}

module.exports = TotalCommand;
