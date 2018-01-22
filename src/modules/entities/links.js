const mongo = require('../mongo.js');

module.exports = {
  save: async (message) => {
    const links = message.getLinks();
    const db = await mongo.connect();
    for (const link of links) {
      db.collection('Links').findOneAndUpdate({
        href: link.href,
        'channel.id': message.channel.id
      }, {
        $setOnInsert: {
          href: link.href,
          caption: link.caption,
          channel: {
            id: message.channel.id,
            name: message.channel.name
          },
          author: message.author,
          timestamp: message.timestamp,
          createdAt: new Date()
        },
      }, {
        upsert: true
      });
    }
  }
};
