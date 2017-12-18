const assert = require('assert');
const { web } = require('../utils/slack.js');
const ChatMessage = require('./chatMessage.js');

class Channel {
  constructor(data, botId) {
    assert(data);
    assert(botId);
    this.bot = botId;
    this.id = data.id;
    this.name = data.name;
    // Array of channel member's ids
    this.members = new Set(data.members);
  }

  async getMessages(filter = {}) {
    let messages = [];
    let count = 0;
    let response;
    let latest;
    do {
      response = await web.channels.history(this.id, { latest });
      const chatMessages = response.messages.map(message => new ChatMessage(message, this));
      messages = messages.concat(filter.all ?
        chatMessages :
        chatMessages.filter(chatMessage => chatMessage.isTextMessage() && chatMessage.author !== this.bot && chatMessage.containsLink())
      );
      count = messages.length;
      latest = messages[count - 1].ts;
    } while(response.has_more);
    return messages;
  }

  memberJoined (memberId) {
    this.members.add(memberId);
  }

  memberLeft (memberId) {
    this.members.delete(memberId);
  }
}

module.exports = Channel;
