const Command = require('./command.js');

class VersionCommand extends Command {
  constructor(chatMessage) {
    super(chatMessage);
  }

  handle(message, channel) {
    super.handle(message, channel);
    this.rtm.sendMessage(`[feature/polishing, wip] v${process.env.npm_package_version}`, channel);
  }
}

module.exports = VersionCommand;
