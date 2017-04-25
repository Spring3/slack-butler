const ScanCommand = require('./commands/scanCommand');
const TotalCommand = require('./commands/totalCommand');
const ListCommand = require('./commands/listCommand');
const HelpCommand = require('./commands/helpCommand');

const botCommands = {
  scan: ScanCommand,
  total: TotalCommand,
  list: ListCommand,
  help: HelpCommand,
};

const listRegex = /list(\s+)?(\d+)?/g;

class Command {
  constructor(type, channel, chatMessage) {
    this.type = type;
    this.channel = channel;
    this.chatMessage = chatMessage;
  }

  execute(rtm, message) {
    new botCommands[this.type](rtm, this.chatMessage).handle(message, this.channel);
  }

  static isCommand(text) {
    if (!text) return false;
    return Command.getCommandType(text);
  }

  static getCommandType(text) {
    for(const [key] of Object.entries(botCommands)) {
      if (text.includes(key)) {
        return key;
      }
    }
    return undefined;
  }
}

module.exports = Command;
