const AbstractCommand = require('./abstractCommand');

class HelpCommand extends AbstractCommand {
  constructor(rtm, chatMessage) {
    super(rtm, chatMessage);
  }

  handle(message, channel) {
    super.handle(message, channel);
    this.rtm.sendMessage(`Hi, <@${this.chatMessage.author}>! My name is Star - and my purpose is to save the useful links people share in this channel.`, channel);
    this.rtm.sendMessage('My supported commands:' +
      '```\n*total* - print the amount of links saved.\n' +
      '[TODO] *blacklist* - print the black listed key-words.\n' +
      '[TODO] *ban <keyword>* - add a key word to the blacklist.\n' +
      '[TODO] *unban <keyword>* - remove a key word from the blacklist.\n' +
      '[TODO] *link* - print out the link to the website.\n' +
      '*scan* - to scan current channel for links and attachments.\n', channel);
  }
}

module.exports = HelpCommand;
