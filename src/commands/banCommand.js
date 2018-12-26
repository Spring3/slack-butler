const assert = require('assert');
const { activeBots } = require('../modules/botStorage');

module.exports = {
  handle({ text, channelId, teamId }) {
    const messageParts = text.split(' ');
    if (messageParts.length > 1) {
      console.log("Add the phrase to the blacklist");
      // blacklist.ban(messageParts[1].toLowerCase().trim());
    }
    // move this out to the base class (prototype)
    const bot = activeBots.get(teamId);
    assert(bot);
    bot.rtm.sendMessage('[Not implemented] A given value will be added to the blacklist', channelId);
    // this.rtm.sendMessage(`Blacklist: ${blacklist.getValues()}`, channel);
  }
};
