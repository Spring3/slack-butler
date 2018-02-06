const assert = require('assert');
const url = require('url');
const { reactionEmoji } = require('./configuration.js');
const blacklist = require('../modules/blacklist.js');
const Command = require('./command.js');
const { getTitles } = require('../utils/url.js');

const urlPattern = /(https?|ftp):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;

/**
 * Representation of a slack message
 */
class ChatMessage {
  constructor(message, channel) {
    assert(message, 'ChatMessage message is undefined');
    const payload = typeof message === 'string' ? JSON.parse(message) : message;
    this.type = payload.type;
    this.subtype = payload.subtype;
    this.author = payload.user;
    this.text = payload.text;
    this.timestamp = payload.ts;
    // used by commands
    this.channel = channel;
    this.botId = this.channel.team.bot.id;
    this.reactions = payload.reactions || [];
    this.hasLink = this.containsLink() || false;
    this.isDirect = this.isDirectMessage() || false;
  }

  /**
   * Check if a message is a plain text type
   * @return {Boolean}
   */
  isTextMessage() {
    return (this.type === 'message' && !this.subtype);
  }

  /**
   * Check if the message was already marked as processed by the bot
   * @return {Boolean}
   */
  isMarked() {
    const found = this.reactions.filter(reaction =>
      reaction.name === reactionEmoji.toLowerCase() && reaction.users.includes(this.botId))[0];
    return found !== undefined;
  }

  /**
   * Mark the slack message with the reaction emoji
   * @return {undefined}
   */
  mark() {
    const lowReactionEmoji = reactionEmoji.toLowerCase();
    const existingReaction = this.reactions.filter(reaction => reaction.name === lowReactionEmoji)[0];
    if (existingReaction === undefined) {
      this.reactions.push({
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
  containsLink() {
    if (this.hasLink === undefined && this.text) {
      return /(https?|ftp):\/\//gm.test(this.text);
    }
    return this.hasLink;
  }

  /**
   * Check if the message is a direct message to the bot
   * @return {Boolean}
   */
  isDirectMessage() {
    if (this.isDirect === undefined && this.text) {
      return this.text.includes(`<@${this.botId}>`);
    }
    return this.isDirect;
  }

  /**
   * Get links from the message
   * @return {[object]}
   */
  getLinks() {
    const matches = this.text.match(urlPattern);
    if (matches === null) {
      return [];
    }

    const links = new Set();

    // filtering links from regex results
    for (const link of matches) {
      if (!link) continue; // eslint-disable-line
      const urlObj = url.parse(link);
      if (urlObj.protocol && urlObj.pathname) {
        let isValid = true;
        for (const bannedKeyword of blacklist.getValues()) {
          if (isValid) {
            isValid = !link.includes(bannedKeyword);
          }
        }
        if (isValid) {
          for (const title of getTitles(link)) {
            links.add(title);
          }
        }
      }
    }
    return [...links];
  }

  /**
   * Get the content of a direct message
   * @return {string}
   */
  getDirectMessage() {
    return this.text.replace(`<@${this.botId}>`, '').toLowerCase().trim();
  }

  /**
   * Convert the message to a command if possible
   * @return {undefined|Command}
   */
  getCommand() {
    if (this.isDirectMessage()) {
      const mention = this.getDirectMessage();
      const commandType = mention.split(' ')[0].toLowerCase();
      return new Command(commandType, this);
    }
    return undefined;
  }
}

module.exports = ChatMessage;
