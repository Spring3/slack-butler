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
    this.type = type;
    this.channel = channel;
    this.chatMessage = chatMessage;
  }

  execute(rtm, message) {
    new botCommands[this.type](rtm, this.chatMessage).handle(message, this.channel);
  }

  static getCommandType(text) {
    if (!text) return undefined;
    for (const [key] of Object.entries(botCommands)) {
      if (text.includes(key)) {
        return key;
      }
    }
    return undefined;
  }

  static fromMessage(chatMessage) {
    if (chatMessage && chatMessage.isDirectMessage()) {
      const mention = chatMessage.getDirectMessage();
      const commandType = Command.getCommandType(mention);
      if (commandType) {
        return new Command(commandType, chatMessage.channel, chatMessage);
      }
    }
    return undefined;
  }
}

module.exports = Command;
