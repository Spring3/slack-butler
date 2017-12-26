const assert = require('assert');
const { web } = require('../utils/slack.js');
const ChatMessage = require('./chatMessage.js');

class Channel {
  constructor(data, botId) {
    assert(data, 'Channel data is undefined');
    assert(botId, 'Channel botId is undefined');
    this.botId = botId;
    this.id = data.id;
    this.name = data.name || 'DM';
    // Array of channel member's ids
    this.members = new Set(data.members);
  }

  async getMessages(filter = {}) {
    let messages = [];
    let response;
    let next;
    do {
      const cursor = next ? { cursor: next } : {};
      response = await web.conversations.history(this.id, cursor);
      response = typeof response === 'string' ? JSON.parse(response) : response;
      const chatMessages = response.messages.map(message => new ChatMessage(message, this));
      next = response.response_metadata && response.response_metadata.next_cursor;
      messages = messages.concat(filter.all ?
        chatMessages :
        chatMessages.filter(chatMessage => chatMessage.isTextMessage() && chatMessage.author !== this.botId && chatMessage.containsLink())
      );
    } while(response.has_more);
    return messages;
  }

  memberJoined (memberId) {
    this.members.add(memberId);
  }

  memberLeft (memberId) {
    this.members.delete(memberId);
  }

  getMessage(message) {
    return new ChatMessage(message, this);
  }
}

module.exports = Channel;
