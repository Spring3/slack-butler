const mongo = require('../mongo.js');

module.exports = {
  save: async (message) => {
    const links = message.getLinks();
    const db = await mongo.connect();
    for (const link of links) {
      db.collection('Highlights').findOneAndUpdate({
        href: link.href,
        author: message.author
      }, {
        $setOnInsert: {
          href: link.href,
          caption: link.caption,
          channel: {
            id: message.channel.id,
            name: message.channel.name
          },
          author: message.author,
          createdAt: new Date()
        },
      }, {
        upsert: true
      });
    }
  }
};
