const assert = require('assert');
const blacklist = require('../modules/blacklist.js');
const { getTitles } = require('../utils/url.js');
const url = require('url');

const urlPattern = /(https?|ftp):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;

class ChatMessage {
  constructor(message, channel) {
    assert(message);
    const payload = typeof message === 'string' ? JSON.parse(message) : message;
    this.type = payload.type;
    this.subtype = payload.subtype;
    this.author = payload.user;
    this.text = payload.text;
    this.timestamp = payload.ts;
    this.channel = channel;
    this.reactions = payload.reactions || [];
    this.hasLink = this.containsLink() || false;
    this.isDirect = this.isDirectMessage() || false;
  }

  isTextMessage() {
    return (this.type === 'message' && !this.subtype);
  }

  isMarked() {
    for (const reaction of this.reactions) {
      if (reaction.name === 'star' && reaction.users.includes(this.channel.botId)) {
        return true;
      }
    }
    return false;
  }

  mark() {
    this.reactions.push({
      name: 'star',
      users: [this.channel.botId],
    });
  }

  containsLink() {
    if (this.hasLink === undefined && this.text) {
      return /(https?|ftp):\/\//gm.test(this.text);
    }
    return this.hasLink;
  }

  isDirectMessage() {
    if (this.isDirect === undefined && this.text) {
      return this.text.includes(`<@${this.channel.botId}>`);
    }
    return this.isDirect;
  }

  getLinks() {
    const matches = this.text.match(urlPattern);
    if (matches === null) {
      return [];
    }

    const links = new Set();

    // filtering links from regex results
    for (const link of matches) {
      if (!link) continue;
      const urlObj = url.parse(link);
      if (!urlObj.protocol || !urlObj.pathname) continue;
      let isValid = true;
      for (const bannedKeyword of blacklist.getValues()) {
        if (isValid) {
          isValid = !link.includes(bannedKeyword);
        }
      }
      if (isValid) {
        links.add(getTitles(link));
      }
    }
    return links.values();
  }

  getDirectMessage() {
    return this.text.replace(`<@${this.channel.botId}>`, '').toLowerCase().trim();
  }
}

module.exports = ChatMessage;
