const botStorage = require('./botStorage.js');

class Team {
  constructor(data) { // eslint-disable-line
    this.name = data.team_name; // eslint-disable-line
    this.id = data.team_id; // eslint-disable-line
    this.domain = data.domain;
    this.createdAt = data.createdAt;
    this.channels = null;
  }

  async getChannels() {
    const teamBot = botStorage.get(this.id);
    const result = await teamBot.webClient.users.conversations({ user: teamBot.id });
    console.log(result);
  }
}

module.exports = Team;
