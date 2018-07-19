const botStorage = require('./botStorage.js');
const requestHelper = require('../utils/requests.js');
const Channel = require('./channel.js');

class Team {
  constructor(data) { // eslint-disable-line
    this.name = data.name; // eslint-disable-line
    this.id = data.id; // eslint-disable-line
    this.createdAt = data.createdAt || new Date();
    this.channels = new Map();
  }

  // Example response:
  /*
    { ok: true,
  channels:
   [ { id: 'C8S5U2Z97',
       name: 'general',
       is_channel: true,
       is_group: false,
       is_im: false,
       created: 1515975558,
       is_archived: false,
       is_general: true,
       unlinked: 0,
       name_normalized: 'general',
       is_shared: false,
       creator: 'U8S5U2V0R',
       is_ext_shared: false,
       is_org_shared: false,
       shared_team_ids: [Array],
       pending_shared: [],
       is_pending_ext_shared: false,
       is_private: false,
       is_mpim: false,
       topic: [Object],
       purpose: [Object],
       previous_names: [] } ],
  response_metadata: { next_cursor: '' },
  scopes: [ 'identify', 'bot:basic' ],
  acceptedScopes: [ 'channels:read', 'groups:read', 'mpim:read', 'im:read', 'read' ] }
     */
  async getBotChannels() {
    if (botStorage.has(this.id)) {
      const bot = botStorage.get(this.id);
      const { ok = [], error = [] } =
        await requestHelper.fetchAllPages(bot.webClient.users.conversations)({ user: bot.id });
      for (const result of error) {
        console.log(`Error when fetching bot channels: ${result.error} for team ${this.id}`);
      }
      return Promise.all(ok.reduce((acc, response) =>
        acc.concat(response.channels.map((channelData) => {
          const channel = new Channel(channelData, this.id);
          this.channels.set(channel.id, channel);
          return channel.fetchMembers();
        })), []));
    }
    return Promise.resolve();

    // let cursor;
    // do {
    //   const params = { user: teamBot.id };
    //   if (cursor) {
    //     params.cursor = cursor;
    //   }
    //   const result = await teamBot.webClient.users.conversations(params);
    //   if (result.ok) {
    //     for (const channel of result.channels) {
    //       this.channels.set(channel.id, new Channel(channel, this.id));
    //     }
    //     cursor = result.response_metadata.next_cursor;
    //   } else {
    //     console.error(result.error);
    //   }
    // } while (cursor);
  }


  toJSON() {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      channels: Array.from(this.channels.keys())
    };
  }
}

module.exports = Team;
