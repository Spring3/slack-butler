const assert = require('assert');
const scanCommand = require('../commands/scanCommand');
const totalCommand = require('../commands/totalCommand');
const helpCommand = require('../commands/helpCommand');
const versionCommand = require('../commands/versionCommand');
const printCommand = require('../commands/printCommand');
const searchCommand = require('../commands/searchCommand');

const botCommands = {
  scan: scanCommand,
  total: totalCommand,
  help: helpCommand,
  version: versionCommand,
  print: printCommand,
  search: searchCommand
};

module.exports = {
  from(chatMessage) {
    assert(chatMessage, 'chatMessage is undefined');
    if (chatMessage.isDirect()) {
      const messageContent = chatMessage.getContent();
      const commandType = messageContent.split(' ')[0];
      return botCommands[commandType];
    }
    return undefined;
  }
};
