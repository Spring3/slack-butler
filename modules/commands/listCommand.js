const AbstractCommand = require('./abstractCommand');

class ListCommand extends AbstractCommand {
  constructor(rtm, chatMessage) {
    super(rtm, chatMessage);
  }

  handle(message, channel) {
    super.handle(message, channel);
    /*
      db.getLinks().then((result) => {
                web.files.upload('links', {
                  title: 'Total recap of links',
                  content: result,
                  channels: channel
                }, (err, data) => { if (err) console.error(err); })
              });

      if (mentionedMessage.indexOf('list') >= 0) {
            const pattern = /\d+/g;
            const result = mentionedMessage.match(pattern);
            let offset, limit;
            if (result.length === 2) {
              offset = parseInt(result[0], 10);
              limit = parseInt(result[1], 10) - offset;
            } else if (result.length === 1) {
              limit = parseInt(result[0], 10);
            }
            db.getLinks(limit, offset).then((links) => {
              web.files.upload('links', {
                title: 'requested links',
                content: links,
                channels: channel
              }, (err, data) => { if (err) console.error(err); });
            });
          }
    */
  }
}

module.exports = ListCommand;
