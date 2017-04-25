const AbstractCommand = require('./abstractCommand');

class HelpCommand extends AbstractCommand {
  constructor(rtm, chatMessage) {
    super(rtm, chatMessage);
  }

  handle(message, channel) {
    super.handle(message, channel);
    this.rtm.sendMessage(`Hi, <@${this.chatMessage.author}>! My name is Star - and my purpose is to save the links and attachments that people share in this channel.`, channel);
    this.rtm.sendMessage('You may want to ask me for some of them. Simply ping me with one of the supported commands:' +
      '```\n\'list\' - to display all saved items.\n' +
      '\'list n\' - give a list of last n links saved.\n' +
      '\'list n-m\' - print the lsit of links from n (inc) to m (exc).\n' +
      '\'total\' - print the amount of links saved.\n' +
      '\'scan\' - to scan current channel for links and attachments.\n' +
      '\'scan n\' - [TODO] to scan first n messages starting from current\n' +
      '\'show n\' - [TODO] print out the link for current user.\n' +
      '\'next\' - [TODO] print the next link from the position the user stopped reviewing them\n```', channel);
  }
}

module.exports = HelpCommand;
