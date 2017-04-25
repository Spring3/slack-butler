const Bot = require('./bot');
const Command = require('./command');

const blackList = new Set();
const urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

class ChatMessage {
  constructor(message) {
    this.type = message.type;
    this.subtype = message.subtype;
    this.author = message.user;
    this.text = message.text;
    this.channel = message.channel;
    this.containsLink = this.containsLink();
    this.isDirect = this.isMention();
  }

  isTextMessage() {
    return (this.type === 'message' && !this.subtype);
  }

  containsLink() {
    if (this.containsLink === undefined) {
      return this.text.includes('http://') || this.text.includes('https://');
    }
    return this.containsLink;
  }

  isDirectMessage() {
    if (this.isDirect === undefined) {
      return this.text.includes(`<@${Bot.instance.id}`);
    }
    return this.isDirect;
  }

  getLinks() {
    const links = new Set();
    this.text.match(urlPattern).filter((match) => {
      if (!match) return false;
      const link = match[0];
      let isValid = true;
      for(const bannedLink of blackList) {
        if (isValid) {
          isValid = link.includes(bannedLink);
        }
      }
      return isValid;
    }).forEach(link => links.add(link));

    const payload = [];
    for(const value of links.values()) {
      // getting the link name, replacing / with spaces and getting the name part
      // for /bnoguchi/hooks-js it will be hooks-js
      let linkTitle;
      if (value[3]) {
        linkTitle = value[3].replace(new RegExp('/', 'g'), ' ').trim().split(' ');
        linkTitle = linkTitle[linkTitle.length - 1];
        if (linkTitle) {
          linkTitle = linkTitle.split('?')[0]; // to get rid of query parameters
        }
      }
      // if name was not set or it is a number
      if (!linkTitle || /^\d+$/.test(linkTitle)) {
        // just taking the website name as a caption for the link
        linkTitle = value[0].split('//')[1].split('?')[0];
      }
      payload.push({
        caption: linkTitle,
        href: value[0],
      });
    }
    // rtm.sendMessage(`Total links found: ${totalLinks}. New: ${result}. Blacklist: ${blacklist}`, this.channel);
    return payload;
  }

  getDirectMessage() {
    return this.text.replace(`<@${Bot.instance.id}>`, '').toLowerCase().trim();
  }

  getCommand() {
    const commandType = this.isCommand();
    if (commandType) {
      return new Command(commandType, this.channel, this);
    }
    return undefined;
  }

  isCommand() {
    if (this.isDirectMessage()) {
      const mention = this.getDirectMessage();
      const command = Command.isCommand(mention);
      return command;
    }
    return false;
  }

  static ban(text) {
    blackList.add(text);
  }

  static unban(text) {
    blackList.delete(text);
  }
}

module.exports = ChatMessage;
