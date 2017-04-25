const AbstractCommand = require('./abstractCommand');

class ScanCommand extends AbstractCommand {
  constructor(rtm, chatMessage) {
    super(rtm, chatMessage);
  }

  handle(message, channel) {
    super.handle(message, channel);
    this.rtm.sendMessage('On it!', channel);
    // TODO: look for messsages using slack api
    // return fetchMessages(channel).then((chunks) => {
    //   processMessages(chunks, channel);
    // });
    /*
      function fetchMessages(channel) {
        return new Promise((resolve, reject) => {
          const chunks = new Map();
          const parse = (err, chunkOfData) => {
            const hasMore = chunkOfData.has_more;
            if (err) {
              console.error(err);
              return reject(err);
            }
            chunkOfData = chunkOfData.messages;
            chunks.set(`chunk${chunks.size}`, chunkOfData);
            if (hasMore) {
              const lastTs = chunkOfData[chunkOfData.length - 1].ts;
              request.get({
                url: 'https://slack.com/api/channels.history',
                qs: {
                  token: process.env.SLACK_API_TOKEN,
                  latest: lastTs,
                  inclusive: 1,
                  channel
                },
              }, function(err, response) {
                parse(err, JSON.parse(response.body));
              });
            } else {
              return resolve(chunks);
            }
          }
          web.channels.history(channel, parse);
        });
      }
    */
  }
}

module.exports = ScanCommand;
