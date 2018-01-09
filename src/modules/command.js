const assert = require('assert');
const ScanCommand = require('./commands/scanCommand');
const TotalCommand = require('./commands/totalCommand');
const HelpCommand = require('./commands/helpCommand');
const BlacklistCommand = require('./commands/blacklistCommand');
const BanCommand = require('./commands/banCommand');
const UnBanCommand = require('./commands/unbanCommand');
const VersionCommand = require('./commands/versionCommand');

const botCommands = {
  scan: ScanCommand,
  total: TotalCommand,
  help: HelpCommand,
  blacklist: BlacklistCommand,
  ban: BanCommand,
  unban: UnBanCommand,
  version: VersionCommand
};

class Command {
  constructor(type, chatMessage) {
    assert(type, 'Command type is undefined');
    assert(chatMessage, 'Command chatMessage is undefined');
    this.type = type;
    this.chatMessage = chatMessage;
  }

  getHandler() {
    if (botCommands[this.type]) {
      return new botCommands[this.type](this.chatMessage);
    }
    return undefined;
  }
}

module.exports = Command;
