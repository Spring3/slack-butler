const Message = require('./message.js');

/**
 *  Slack channel response
 *  { id: 'C8S5U2Z97',
       name: 'general',
       is_channel: true,
       is_group: false,
       is_im: false,
       created: 1515975558,
       is_archived: false,
       is_general: true,
       unlinked: 0,
       name_normalized: 'general',
       is_shared: false,
       creator: 'U8S5U2V0R',
       is_ext_shared: false,
       is_org_shared: false,
       shared_team_ids: [Array],
       pending_shared: [],
       is_pending_ext_shared: false,
       is_private: false,
       is_mpim: false,
       topic: [Object],
       purpose: [Object],
       previous_names: [] }
 */

/**
 * Representation of a slack channel
 */
class Channel {
  constructor(data) {
    this.id = data.id;
    this.isPrivate = data.is_private;
    this.isDM = data.is_im;
    this.isGroupDM = data.is_mpim;
    this.isArchived = data.is_archived;
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
   * Convert the json to the ChatMessage and bind it to current channel
   * @param  {object|string} message - payload of the message
   * @return {undefined|ChatMessage} - undefined if message param was not proivded
   */
  getMessage(message) {
    return new Message(message, this);
  }
}

module.exports = Channel;
