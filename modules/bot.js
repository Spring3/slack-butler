const assert = require('assert');

let botInstance;

class Bot {
  constructor(authData, channelData) {
    assert(authData);
    assert(channelData);
    this.name = authData.self.name;
    this.id = authData.self.id;
    this.mainChannel = {
      id: channelData.id,
      name: channelData.name,
    };
    this.team = {
      name: authData.team.name,
    };
    botInstance = botInstance || this;
  }

  static get instance() {
    return botInstnace;
  }
}

module.exports = Bot;
