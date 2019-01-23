const { BOT_REACTION_EMOJI } = require('../../modules/configuration.js');
const botStorage = require('./botStorage.js');
const urlUtils = require('../utils/url.js');

const urlRegexp = /(https?|ftp):\/\/.*/;

/**
 * Representation of a slack message
 */
class Message {
  /**
    {
      type: 'message',
      user: 'U8S5U2V0R',
      text: 'hello',
      client_msg_id: 'd9412146-155b-438c-ab61-48b2d69b4796',
      team: 'T8S5U2UTT',
      channel: 'C8S5U2Z97',
      event_ts: '1531955105.000250',
      ts: '1531955105.000250'
    }
  */
  constructor(data) {
    this.type = data.type;
    this.author = data.user;
    this.text = data.text;
    this.teamId = data.team;
    this.channelId = data.channel;
    this.timestamp = data.ts;
    this.reactions = data.reactions
      ? new Set(Array.isArray(data.reactions)
        ? data.reactions
        : [data.reactions])
      : new Set();
    this.botId = botStorage.activeBots.has(this.teamId)
      ? botStorage.activeBots.get(this.teamId).id
      : undefined;
  }

  /**
   * Check if the message was already marked as processed by the bot
   * @return {Boolean}
   */
  isMarked() {
    const found = Array.from(this.reactions.values()).find(reaction => reaction.name === BOT_REACTION_EMOJI && reaction.users.includes(this.botId));
    return !!found;
  }

  /**
   * Mark the slack message with the reaction emoji
   * @return {undefined}
   */
  mark() {
    const existingReaction = Array.from(this.reactions.values()).find(reaction => reaction.name === BOT_REACTION_EMOJI);
    if (!existingReaction) {
      this.reactions.add({
        name: BOT_REACTION_EMOJI,
        users: [this.botId]
      });
    } else if (!existingReaction.users.includes(this.botId)) {
      existingReaction.users.push(this.botId);
    }
  }

  /**
   * Check if the message contains a link
   * @return {Boolean}
   */
  hasLinks() {
    return urlRegexp.test(this.text);
  }

  /**
   * Get links from the message
   * @return {[string]}
   */
  getLinks() {
    const regexp = new RegExp(urlRegexp, 'g');
    const matches = this.text.match(regexp);
    regexp.lastIndex = 0;
    if (matches === null) {
      return [];
    }

    return matches.reduce((acc, link) => {
      if (link) {
        acc.push(link.slice(0, -1));
      }
      return acc;
    }, []);
  }

  getLinksData() {
    return urlUtils.getCaption(this.getLinks());
  }

  /**
   * Check if the message is a direct message to the bot
   * @return {Boolean}
   */
  isDirect() {
    return typeof this.botId === 'string' && this.text.includes(`<@${this.botId}>`);
  }

  /**
   * Get the content of a direct message
   * @return {string}
   */
  getContent() {
    return this.text.replace(`<@${this.botId}>`, '').trim();
  }
}

module.exports = Message;
