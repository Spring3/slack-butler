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


  toJSON() {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt
    };
  }
}

module.exports = Team;
