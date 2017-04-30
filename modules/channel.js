const assert = require('assert');

class Channel {
  constructor(data) {
    assert(data);
    this.id = data.id;
    this.name = data.name;
    // Array of channel member's ids
    this.members = data.members;
  }
}

module.exports = Channel;
