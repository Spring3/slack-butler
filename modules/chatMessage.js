const assert = require('assert');
const Bot = require('./bot');
const url = require('url');

const urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;

class ChatMessage {
  constructor(message) {
    assert(message);
    this.type = message.type;
    this.subtype = message.subtype;
    this.author = message.user;
    this.text = message.text;
    this.timestamp = message.ts;
    this.channel = message.channel;
    this.reactions = message.reactions || [];
    this.hasLink = this.containsLink() || false;
    this.isDirect = this.isDirectMessage() || false;
  }

  isTextMessage() {
    return (this.type === 'message' && !this.subtype);
  }

  isMarked() {
    for (const reaction of this.reactions) {
      if (reaction.name === 'star' && reaction.users.includes(Bot.instance.id)) {
        return true;
      }
    }
    return false;
  }

  mark() {
    this.reactions.push({
      name: 'star',
      users: [Bot.instance.id],
    });
  }

  containsLink() {
    if (this.hasLink === undefined && this.text) {
      return this.text.includes('http://') || this.text.includes('https://');
    }
    return this.hasLink;
  }

  isDirectMessage() {
    if (this.isDirect === undefined && this.text) {
      return this.text.includes(`<@${Bot.instance.id}`);
    }
    return this.isDirect;
  }

  getLinks() {
    const links = new Set();
    const matches = this.text.match(urlPattern);
    if (!matches) {
      return [];
    }
    // filtering links from regex results
    matches.filter((link) => {
      if (!link) return false;
      const urlObj = url.parse(link);
      if (!urlObj.protocol || !urlObj.pathname) return false;
      let isValid = true;
      for (const bannedKeyword of Bot.instance.blacklist.getValues()) {
        if (isValid) {
          isValid = !link.includes(bannedKeyword);
        }
      }
      return isValid;
    }).forEach(link => links.add(link));
    const payload = [];
    // setting up link title
    for (const link of links.values()) {
      const urlObj = url.parse(link);
      const linkParts = urlObj.pathname.substring(0, urlObj.pathname.length - 1).split('/');
      let linkTitle = linkParts[linkParts.length - 1].replace(/-/g, ' ');
      // if name was not set or it is a number
      if (!linkTitle || /^\d+$/.test(linkTitle)) {
        // just taking the website name as a caption for the link
        linkTitle = linkParts[0];
      }
      payload.push({
        caption: linkTitle,
        href: link,
      });
    }
    // rtm.sendMessage(`Total links found: ${totalLinks}. New: ${result}. Blacklist: ${blacklist}`, this.channel);
    return payload;
  }

  getDirectMessage() {
    return this.text.replace(`<@${Bot.instance.id}>`, '').toLowerCase().trim();
  }
}

module.exports = ChatMessage;
