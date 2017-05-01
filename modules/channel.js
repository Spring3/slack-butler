const assert = require('assert');

class Channel {
  constructor(data) {
    assert(data);
    this.id = data.id;
    this.name = data.name;
    // Array of channel member's ids
    this.members = data.members;
  }

  async getMessages(bot) {
    let messages = [];
    let count = 0;
    let response;
    let latest;
    do {
      response = await bot.webClient.channels.history(this.id, { latest });
      messages = messages.concat(response.messages);
      count = messages.length;
      latest = messages[count - 1].ts;
    } while(response.has_more);
    return messages;
  }
}

module.exports = Channel;
