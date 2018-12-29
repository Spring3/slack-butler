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
    this.name = data.name;
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
  async fetchMessages(bot) {
    let messages = [];
    let response;
    let next;
    
    do {
      const options = next
      ? {
        cursor: next,
        channel: this.id,
        inclusive: true
      }
      : {
        channel: this.id,
        inclusive: true
      };
      response = await bot.userWebClient.conversations.history(options); // eslint-disable-line no-await-in-loop
      let chatMessages = response.messages.map(message => new Message({ team: bot.teamId, channel: this.id, ...message }));
      next = response.response_metadata && response.response_metadata.next_cursor;
      chatMessages = chatMessages.filter(chatMessage =>  (chatMessage.author !== bot.id && chatMessage.hasLinks() && !chatMessage.isMarked()));
      messages = [...messages, ...chatMessages];
    } while (response.has_more);
    return messages;
  }

  /**
   * Get one message from the current slack channel
   * @param  {Number} timestamp - the moment when a message was posted
   * @return {Promise(ChatMessage)}           [description]
   */
  async fetchMessage(bot, timestamp) {
    const response = await bot.userWebClient.conversations.history({
      channel: this.id,
      latest: timestamp,
      limit: 1,
      inclusive: true
    });
    return new Message({ team: bot.teamId, channel: this.id, ...response.messages[0] });
  }
}

module.exports = Channel;
