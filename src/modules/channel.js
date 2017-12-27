const assert = require('assert');
const { web, userWeb } = require('../utils/slack.js');
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

  async fetchMessages(filter = {}) {
    let messages = [];
    let response;
    let next;
    do {
      const options = next ? { cursor: next, inclusive: true } : { inclusive: true };
      response = await userWeb.conversations.history(this.id, options);
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

  async fetchMessage(timestamp) {
    let response = await userWeb.conversations.history(this.id, { latest: timestamp, limit: 1, inclusive: true });
    response = typeof response === 'string' ? JSON.parse(response) : response;
    return this.getMessage(response.messages[0]);
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
