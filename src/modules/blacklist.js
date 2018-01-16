const assert = require('assert');
const { blacklist } = require('./configuration.js');

const blacklistSet = new Set();

/**
 * Contains the contents that should not appear in the name of the urls that will be saved to the database
 */
class Blacklist {
  constructor() {
    if (![null, undefined, 'undefined', ''].includes(blacklist) && typeof blacklist === 'string') {
      for (const blackListKey of blacklist.split(',')) {
        this.ban(blackListKey);
      }
    }
  }

  /**
   * Add a content to the blacklist
   * @param  {string} text - the word that should not appear in the url
   * @return {undefined}
   */
  ban(text) {
    assert(text, 'Ban text is undefined');
    blacklistSet.add(text.toLowerCase().trim());
  }

  /**
   * Remove a content from the blacklist
   * @param  {string} text - the word that should be removed from the blacklist
   * @return {undefined}
   */
  unban(text) {
    assert(text, 'Unban text is undefined');
    blacklistSet.delete(text.toLowerCase().trim());
  }

  /**
   * Get the contents of the blacklist set
   * @return {[type]} [description]
   */
  getValues() {
    return Array.from(blacklistSet);
  }
}

module.exports = new Blacklist();
