const assert = require('assert');
const ChatMessage = require('./chatMessage.js');

/**
 * Representation of a slack channel
 */
class Channel {
  constructor(data, team) {
    assert(data, 'Channel data is undefined');
    this.team = team;
    this.id = data.id;
    this.name = data.name || 'DM';
    // Array of channel member's ids
    this.members = new Set(data.members);
  }

  /**
   * Get the messages from the current channel
   * @param  {Object} filter - can be empty or contain the "all" property meaning that all mesages need to be fetched
   * if not provided, then only the messages with links will be returned
   * @return {Promise([ChatMessage])}
   */
  async fetchMessages(filter = {}) {
    let messages = [];
    let response;
    let next;
    do {
      const options = next ? { cursor: next, inclusive: true } : { inclusive: true };
      response = await this.team.web.user.conversations.history(this.id, options); // eslint-disable-line no-await-in-loop
      response = typeof response === 'string' ? JSON.parse(response) : response;
      const chatMessages = response.messages.map(message => new ChatMessage(message, this));
      next = response.response_metadata && response.response_metadata.next_cursor;
      messages = messages.concat(filter.all ? chatMessages :
        chatMessages.filter(chatMessage =>
          chatMessage.isTextMessage() && chatMessage.author !== this.team.bot.id && chatMessage.containsLink()));
    } while (response.has_more);
    return messages;
  }

  /**
   * Get one message from the current slack channel
   * @param  {Number} timestamp - the moment when a message was posted
   * @return {Promise(ChatMessage)}           [description]
   */
  async fetchMessage(timestamp) {
    let response = await this.team.web.user.conversations.history(this.id, { latest: timestamp, limit: 1, inclusive: true });
    response = typeof response === 'string' ? JSON.parse(response) : response;
    return this.getMessage(response.messages[0]);
  }

  /**
   * Add a new member to the channel
   * @param  {string} memberId - slack id of a new member
   * @return {undefined}
   */
  memberJoined(memberId) {
    if (memberId) {
      this.members.add(memberId);
    }
  }

  /**
   * Remove a member from the channel
   * @param  {string} memberId - slack id of a new member
   * @return {undefined}
   */
  memberLeft(memberId) {
    if (memberId) {
      this.members.delete(memberId);
    }
  }

  /**
   * Convert the json to the ChatMessage and bind it to current channel
   * @param  {object|string} message - payload of the message
   * @return {undefined|ChatMessage} - undefined if message param was not proivded
   */
  getMessage(message) {
    return new ChatMessage(message, this);
  }
}

module.exports = Channel;
