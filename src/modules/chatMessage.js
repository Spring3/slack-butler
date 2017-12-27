const assert = require('assert');
const url = require('url');
const { reaction_emoji, scan_trigger_emoji } = require('./configuration.js');
const blacklist = require('../modules/blacklist.js');
const Bot = require('./bot.js');
const Command = require('./command.js');
const { getTitles } = require('../utils/url.js');

const urlPattern = /(https?|ftp):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;

class ChatMessage {
  constructor(message, channel) {
    assert(message, 'ChatMessage message is undefined');
    const payload = typeof message === 'string' ? JSON.parse(message) : message;
    this.bot = Bot.getInstance();
    this.type = payload.type;
    this.subtype = payload.subtype;
    this.author = payload.user;
    this.text = payload.text;
    this.timestamp = payload.ts;
    this.channel = channel || payload.channel;
    this.reactions = payload.reactions || [];
    this.hasLink = this.containsLink() || false;
    this.isDirect = this.isDirectMessage() || false;
  }

  isTextMessage() {
    return (this.type === 'message' && !this.subtype);
  }

  isMarked() {
    for (const reaction of this.reactions) {
      if (reaction.name === reaction_emoji.toLowerCase() && reaction.users.includes(this.bot.id)) {
        return true;
      }
    }
    return false;
  }

  isMarkedToScan() {
    if (!scan_trigger_emoji) return true;
    for (const reaction of this.reactions) {
      if (reaction.name === scan_trigger_emoji.toLowerCase() && !reaction.users.includes(this.bot.id)) {
        return true;
      }
    }
    return false;
  }

  mark() {
    this.reactions.push({
      name: reaction_emoji.toLowerCase(),
      users: [this.bot.id],
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
      return this.text.includes(`<@${this.bot.id}>`);
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
    return Array.from(links.values());
  }

  getDirectMessage() {
    return this.text.replace(`<@${this.bot.id}>`, '').toLowerCase().trim();
  }

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
