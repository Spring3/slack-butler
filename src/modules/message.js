const { reactionEmoji } = require('./configuration.js');
const botStorage = require('./botStorage.js');
const urlUtils = require('../utils/url.js');

const urlRegex = /(https?|ftp):\/\/.*/g;

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
    this.reactions = new Set(Array.isArray(data.reactions) ? data.reactions : [data.reactions]);
    console.log(this.reactions);
    this.botId = botStorage.has(this.teamId) ? botStorage.get(this.teamId).id : undefined;
  }

  /**
   * Check if the message was already marked as processed by the bot
   * @return {Boolean}
   */
  isMarked() {
    const found = Array.from(this.reactions.values()).filter(reaction =>
      reaction.name === reactionEmoji.toLowerCase() && reaction.users.includes(this.botId))[0];
    return found !== undefined;
  }

  /**
   * Mark the slack message with the reaction emoji
   * @return {undefined}
   */
  mark() {
    const lowReactionEmoji = reactionEmoji.toLowerCase();
    const existingReaction = Array.from(this.reactions.values()).filter(reaction => reaction.name === lowReactionEmoji)[0];
    if (existingReaction === undefined) {
      this.reactions.add({
        name: lowReactionEmoji,
        users: [this.botId],
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
    return urlRegex.test(this.text);
  }

  /**
   * Get links from the message
   * @return {[string]}
   */
  getLinks() {
    const matches = this.text.match(urlRegex);
    if (matches === null) {
      return [];
    }

    return matches.filter(link => !!link).map(link => link.slice(0, -1));
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
  getPlot() {
    return this.text.replace(`<@${this.botId}>`, '').toLowerCase().trim();
  }

  // /**
  //  * Convert the message to a command if possible
  //  * @return {undefined|Command}
  //  */
  // getCommand() {
  //   if (this.isDirectMessage()) {
  //     const mention = this.getDirectMessage();
  //     const commandType = mention.split(' ')[0].toLowerCase();
  //     return new Command(commandType, this);
  //   }
  //   return undefined;
  // }
}

module.exports = Message;
