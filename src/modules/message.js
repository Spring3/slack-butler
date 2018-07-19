const url = require('url');
const { reactionEmoji } = require('./configuration.js');
const blacklist = require('../modules/blacklist.js');
const Command = require('./command.js');
const { getTitles } = require('../utils/url.js');

const urlPattern = /(https?|ftp):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;

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
    this.time = data.ts;
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

module.exports = Message;
