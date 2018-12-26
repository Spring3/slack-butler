const assert = require('assert');
const { activeBots } = require('../modules/botStorage');

module.exports = {
  handle({ text, channelId }) {
    // move this out to the base class (prototype)
    const bot = activeBots.get(teamId);
    assert(bot);
    blacklist.unban(text.split(' ')[1].toLowerCase().trim());
    // bot.rtm.sendMessage(`Blacklist: ${blacklist.getValues()}`, channelId);
    bot.rtm.sendMessage('[Not implemented] Blacklist value will be removed here', channelId);
  }
};
