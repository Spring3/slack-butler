const Command = require('./command');

class HelpCommand extends Command {
  constructor(chatMessage) {
    super(chatMessage);
  }

  handle(message, channel) {
    super.handle(message, channel);
    this.rtm.sendMessage(`Hi, <@${this.chatMessage.author}>! My name is Star - and my purpose is to save useful links people share in this channel.`, channel);
    this.rtm.sendMessage('My supported commands:\n' +
      '[TODO] *link* - print out the link to the website.\n' +
      '*total* - print the amount of links saved.\n' +
      '*blacklist* - print the blacklisted key words.\n' +
      '*ban <keyword>* - add a key word to the blacklist.\n' +
      '*unban <keyword>* - remove a key word from the blacklist.\n' +
      `*scan* - to scan this channel for links and attachments.\n`, channel);
  }
}

module.exports = HelpCommand;
