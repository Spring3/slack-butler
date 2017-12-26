const assert = require('assert');
const { blacklist } = require('./configuration.js');

const blacklistSet = new Set();

class Blacklist {
  constructor() {
    if (![null, undefined, 'undefined', ''].includes(blacklist) && typeof blacklist === 'string') {
      for (const blackListKey of blacklist.split(',')) {
        this.ban(blackListKey);
      }
    }
  }

  ban(text) {
    assert(text, 'Ban text is undefined');
    blacklistSet.add(text.toLowerCase().trim());
  }

  unban(text) {
    assert(text, 'Unban text is undefined');
    blacklistSet.delete(text.toLowerCase().trim());
  }

  getValues() {
    return Array.from(blacklistSet);
  }
}

module.exports = new Blacklist();
