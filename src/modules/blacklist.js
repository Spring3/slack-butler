const assert = require('assert');

const blacklist = new Set();

class Blacklist {
  constructor() {
    if (![null, undefined, 'undefined', ''].includes(process.env.LINK_BLACKLIST)) {
      for (const blackListKey of process.env.LINK_BLACKLIST.split(',')) {
        this.ban(blackListKey);
      }
    }
  }

  ban(text) {
    assert(text);
    blacklist.add(text.toLowerCase().trim());
  }

  unban(text) {
    assert(text);
    blacklist.delete(text.toLowerCase().trim());
  }

  getValues() {
    return Array.from(blacklist);
  }
}

module.exports = new Blacklist();
