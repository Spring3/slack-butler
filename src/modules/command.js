const assert = require('assert');
const ScanCommand = require('../commands/scanCommand');
const TotalCommand = require('../commands/totalCommand');
const HelpCommand = require('../commands/helpCommand');
const BlacklistCommand = require('../commands/blacklistCommand');
const BanCommand = require('../commands/banCommand');
const UnBanCommand = require('../commands/unbanCommand');
const VersionCommand = require('../commands/versionCommand');
const SearchCommand = require('../commands/searchCommand');

const botCommands = {
  scan: ScanCommand,
  total: TotalCommand,
  help: HelpCommand,
  blacklist: BlacklistCommand,
  ban: BanCommand,
  unban: UnBanCommand,
  version: VersionCommand,
  search: SearchCommand
};

module.exports = {
  from(chatMessage) {
    assert(chatMessage, 'chatMessage is undefined');
    if (chatMessage.isDirect()) {
      const messageContent = chatMessage.getContent();
      const commandType = messageContent.split(' ')[0];
      return botCommands[commandType];
    }
  }
};
