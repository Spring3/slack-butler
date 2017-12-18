const assert = require('assert');
const ScanCommand = require('./commands/scanCommand');
const TotalCommand = require('./commands/totalCommand');
const HelpCommand = require('./commands/helpCommand');
const BlacklistCommand = require('./commands/blacklistCommand');
const BanCommand = require('./commands/banCommand');
const UnBanCommand = require('./commands/unbanCommand');

const botCommands = {
  scan: ScanCommand,
  total: TotalCommand,
  help: HelpCommand,
  blacklist: BlacklistCommand,
  ban: BanCommand,
  unban: UnBanCommand,
};

class Command {
  constructor(type, channel, chatMessage) {
    assert(type);
    assert(chatMessage);
    this.type = type;
    this.channel = channel;
    this.chatMessage = chatMessage;
  }

  execute(message, bot) {
    new botCommands[this.type](this.chatMessage, bot).handle(message, this.channel);
  }

  static getCommandType(directMessage) {
    if (!directMessage) return undefined;
    const command = directMessage.split(' ')[0].toLowerCase();
    return botCommands[command] ? command : undefined;
  }

  static fromMessage(chatMessage) {
    if (chatMessage && chatMessage.isDirectMessage()) {
      const mention = chatMessage.getDirectMessage();
      const commandType = Command.getCommandType(mention);
      if (commandType) {
        return new Command(commandType, chatMessage.channel.id, chatMessage);
      }
    }
    return undefined;
  }
}

module.exports = Command;
