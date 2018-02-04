const mongo = require('../modules/mongo.js');

module.exports = {
  save: async (message, userId) => {
    const links = message.getLinks();
    const db = await mongo.connect();
    for (const link of links) {
      db.collection('Highlights').findOneAndUpdate({
        href: link.href,
        user: userId
      }, {
        $setOnInsert: {
          href: link.href,
          caption: link.caption,
          channel: {
            id: message.channel.id,
            name: message.channel.name
          },
          author: message.author,
          user: userId,
          timestamp: message.timestamp,
          createdAt: new Date()
        },
      }, {
        upsert: true
      });
    }
  }
};
