const assert = require('assert');

class Channel {
  constructor(data) {
    assert(data);
    this.id = data.id;
    this.name = data.name;
    // Array of channel member's ids
    this.members = new Set(data.members);
    
    this.joined = this.joined.bind(this);
    this.left = this.left.bind(this);
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

  joined(memberId) {
    this.members.add(memberId);
  }

  left(memberId) {
    this.members.delete(memberId);
  }
}

module.exports = Channel;
