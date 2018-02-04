const assert = require('assert');

class Team {
  constructor({ access_token, scope, team_name, team_id, bot, createdAt = new Date() }) { // eslint-disable-line
    assert(access_token);
    assert(scope);
    assert(team_name);
    assert(team_id);
    assert(bot);
    assert(bot.bot_user_id);
    assert(bot.bot_access_token);
    assert(createdAt);
    this.accessToken = access_token; // eslint-disable-line
    this.scope = scope;
    this.name = team_name; // eslint-disable-line
    this.id = team_id; // eslint-disable-line
    this.bot = {
      id: bot.bot_user_id,
      token: bot.bot_access_token
    };
    this.createdAt = createdAt;
  }
}

module.exports = Team;
