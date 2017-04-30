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

  static isCommand(text) {
    if (!text) return false;
    return Command.getCommandType(text);
  }

  static getCommandType(text) {
    for (const [key] of Object.entries(botCommands)) {
      if (text.includes(key)) {
        return key;
      }
    }
    return undefined;
  }
}

module.exports = Command;
