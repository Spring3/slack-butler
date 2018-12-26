const assert = require('assert');
const { activeBots } = require('../modules/botStorage.js');

module.exports = {
  handle({ channelId, teamId, author }) {
    // move this out to the base class (prototype)
    const bot = activeBots.get(teamId);
    assert(bot);
    bot.rtm.sendMessage(`Hi, <@${author}>! ` +
      'My name is Star - and my purpose is to save useful links people share in this channel.', channelId);
    bot.rtm.sendMessage('My supported commands:\n' +
      '[TODO] *link* - print out the link to the website.\n' +
      '*total* - print the amount of links saved.\n' +
      '*blacklist* - print the blacklisted key words.\n' +
      '*ban <keyword>* - add a key word to the blacklist.\n' +
      '*unban <keyword>* - remove a key word from the blacklist.\n' +
      '*scan* - to scan this channel for links and attachments.\n' +
      '*print* - perform a search and print the requested amount of links\n' +
      'Example: `print top 10`, `print top 3 favorites`, `print /github.com/ 2`\n' +
      '*version* - to print the version of the bot\n', channelId);
  }
}
