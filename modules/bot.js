const Channel = require('./channel');
const assert = require('assert');

let botInstance;

class Bot {
  constructor(authData, channelData) {
    assert(authData);
    assert(channelData);
    this.name = authData.name;
    this.id = authData.id;
    this.mainChannel = new Channel(channelData);
    botInstance = botInstance || this;
  }

  static get instance() {
    return botInstance;
  }
}

module.exports = Bot;
