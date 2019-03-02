const _ = require('lodash');
const { WebClient, RTMClient } = require('@slack/client');
const {
  AUTO_SCAN_INTERVAL_MS,
  BOT_REACTION_EMOJI,
  USER_FAVORITES_TRIGGER_EMOJI
} = require('../../modules/configuration.js');
const mongo = require('../../modules/mongo.js');
const Message = require('./message.js');
const TeamEntity = require('../../entities/team.js');
const Links = require('../../entities/links.js');
const Highlights = require('../../entities/highlights.js');
const Channel = require('./channel.js');
const Command = require('./command.js');
const Users = require('../../entities/users.js');
const urlUtils = require('../utils/url.js');

/**
 * A class of a slack bot
 */
class Bot {
  constructor(data) {
    const {
      bot = {},
      scope,
      team_id,
      access_token
    } = data;
    this.userToken = data.userToken || access_token;
    this.token = data.token || bot.bot_access_token;
    this.id = data.slackId || bot.bot_user_id;
    this.rtm = new RTMClient(this.token);
    this.userWebClient = new WebClient(this.userToken);
    this.scopes = data.scopes || (scope || '').split(',');
    this.teamId = data.teamId || team_id;
    this.channels = new Map();
    if (AUTO_SCAN_INTERVAL_MS) {
      this.scanningInterval = this.beginScanningInterval();
    }
  }

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
  async getChannels() {
    const requestBody = { types: 'public_channel,private_channel,mpim,im', user: this.id };
    let cursor;

    do {
      const nextRequsetBody = cursor ? Object.assign({ cursor }, requestBody) : requestBody;
      const response = await this.rtm.webClient.users.conversations(nextRequsetBody); // eslint-disable-line
      if (response.ok) {
        cursor = response.response_metadata.next_cursor;
        for (const channelData of response.channels) {
          this.channels.set(channelData.id, new Channel(channelData));
        }
      } else {
        console.error('Error when fetching channels', response.error);
      }
    } while (cursor);
  }

  /**
   * Put an reaction emoji on the behalf of the bot
   * @param  {ChatMessage} message
   * @param  {string} emoji   - code for the emoji without colon sign (:)
   * @return {Promise}
   */
  async react(message, emoji = BOT_REACTION_EMOJI) {
    if (!message.isMarked()) {
      try {
        message.mark();
        await this.rtm.webClient.reactions.add({
          name: emoji,
          channel: message.channelId,
          timestamp: message.timestamp
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  /**
   * Starts the automatic scan interval
   * @return {function} - function to stop the interval
   */
  beginScanningInterval() {
    return setInterval(() => {
      const command = `<@${this.id}> scan`;
      for (const channel of this.channels.values()) { // eslint-disable-line no-unused-vars
        const chatMessage = new Message({
          type: 'message',
          text: command,
          channel: channel.id
        });
        const botCommand = Command.from(chatMessage);
        if (botCommand) {
          botCommand.handle(chatMessage);
        }
      }
    }, AUTO_SCAN_INTERVAL_MS);
  }

  /**
   * Stop the bot activity
   * @return {undefined}
   */
  shutdown() {
    clearInterval(this.scanningInterval);
  }

  /**
   * Start the bot activity
   * @return {undefined}
   */
  start() {
    this.init();
    this.rtm.start();
  }

  /**
   * Set up bot's event handlers
   * @return {undefined}
   */
  init() {
    const botJoinedChannel = (msg) => {
      if (!this.channels.has(msg.channel.id)) {
        this.channels.set(msg.channel.id, new Channel(msg.channel));
      }
      return Promise.all(msg.channel.members.filter(id => id !== this.id).map(async (id) => {
        const { ok, user, error } = await this.rtm.webClient.users.info({ user: id });
        if (ok) {
          return Users.save({
            id: user.id,
            teamId: user.team_id || _.get(user, 'profile.team'),
            name: user.real_name || user.name,
            avatar: _.get(user, 'profile.image_original') || _.get(user, 'profile.image_192')
          });
        }
        console.error(error);
        return Promise.resolve();
      }));
    };

    const botLeftChannel = (msg) => {
      if (this.channels.has(msg.channel)) {
        this.channels.delete(msg.channel);
      }
    };

    /**
     {
        ok: true,
        url: 'wss://',
        team: { id: '', name: '', domain: '' },
        self: { id: '', name: 'star' },
        scopes: [ 'identify', 'bot:basic' ],
        acceptedScopes: [ 'rtm:stream', 'client' ]
      }
    */
    this.rtm.once('authenticated', (data) => {
      if (data.ok) {
        TeamEntity.upsert(Object.assign({}, data.team, { bot: this.id }));
        this.getChannels();
      } else {
        console.error(`Error trying to authenticate: ${data.error}`);
      }
    });

    /*
        { type: 'channel_joined',
        channel:
         { id: 'C8SK1H90B',
          name: 'random',
          is_channel: true,
          is_group: false,
          is_im: false,
          created: 1515975558,
          is_archived: false,
          is_general: false,
          unlinked: 0,
          name_normalized: 'random',
          is_shared: false,
          creator: 'U8S5U2V0R',
          is_ext_shared: false,
          is_org_shared: false,
          shared_team_ids: [ 'T8S5U2UTT' ],
          pending_shared: [],
          is_pending_ext_shared: false,
          is_member: true,
          is_private: false,
          is_mpim: false,
          last_read: '1532036696.000315',
          latest:
            { type: 'message',
              user: 'U8S5U2V0R',
              text: '<@U8TPTJAET> hey',
              client_msg_id: '2d9a52f3-8c9a-401a-9b1e-55eca8bf5b72',
              ts: '1532036696.000315' },
          unread_count: 0,
          unread_count_display: 0,
          members: [ 'U8S5U2V0R', 'U8TPTJAET', 'U8V0CM6K1' ],
          topic:
            { value: 'Non-work banter and water cooler conversation',
              creator: 'U8S5U2V0R',
              last_set: 1515975558 },
          purpose:
            { value: 'Some description',
              creator: 'U8S5U2V0R',
              last_set: 1515975558 },
          previous_names: [],
          priority: 0 } }
       */
    this.rtm.on('channel_joined', botJoinedChannel);

    /*
      { type: 'group_joined',
        channel:
         { id: 'GBTTY9WDB',
          name: 'private',
          is_channel: false,
          is_group: true,
          is_im: false,
          created: 1532036276,
          is_archived: false,
          is_general: false,
          unlinked: 0,
          name_normalized: 'private',
          is_shared: false,
          creator: 'U8S5U2V0R',
          is_ext_shared: false,
          is_org_shared: false,
          shared_team_ids: [ 'T8S5U2UTT' ],
          pending_shared: [],
          is_pending_ext_shared: false,
          is_member: true,
          is_private: true,
          is_mpim: false,
          last_read: '1532036284.000160',
          latest:
            { type: 'message',
              user: 'U8S5U2V0R',
              text: '<@U8TPTJAET> hello',
              client_msg_id: 'b02e00f5-840f-449a-b792-17bf4a9e6134',
              ts: '1532036284.000160' },
          unread_count: 0,
          unread_count_display: 0,
          is_open: true,
          members: [ 'U8S5U2V0R', 'U8TPTJAET' ],
          topic: { value: '', creator: '', last_set: 0 },
          purpose: { value: '', creator: '', last_set: 0 },
          priority: 0 } }
    */
    this.rtm.on('group_joined', botJoinedChannel);

    /**
        { type: 'group_left',
        channel: 'CF22KMXKK',
        actor_id: 'U8S5U2V0R',
        event_ts: '1545942621.000700' }
    */
    this.rtm.on('group_left', botLeftChannel);

    /**
        { type: 'channel_left',
        channel: 'CF22KMXKK',
        actor_id: 'U8S5U2V0R',
        event_ts: '1545942621.000700' }
    */
    this.rtm.on('channel_left', botLeftChannel);


    /**
      {
        type: 'message',
        user: 'U8S5U2V0R',
        text: 'hello',
        client_msg_id: 'd9412146-155b-438c-ab61-48b2d69b4796',
        team: 'T8S5U2UTT',
        channel: 'C8S5U2Z97',
        event_ts: '1531955105.000250',
        ts: '1531955105.000250'
      }
    */
    this.rtm.on('message', async (msg) => {
      const channel = this.channels.get(msg.channel || _.get(msg, 'item.channel', {}));
      /*
        subtype usually means that this is some sort of a reply to an existing message.
        before an event with subtype gets send, a reply itself is sent as a message event without a subtype
        as the message event with subtype would be a duplicate
      */
      if (!msg.subtype) {
        const message = new Message(msg);
        if (message.hasLinks() && !message.isMarked()) {
          const ogpData = await urlUtils.forManyAsync(message.getLinks(), urlUtils.fetchOGP);
          try {
            await Promise.all(ogpData.map(({ href, ogp }) => {
              const linkData = Object.assign({ href, ogp }, {
                author: message.author,
                channel: {
                  id: channel.id,
                  name: channel.name
                },
                teamId: this.teamId
              });
              return Links.save(linkData).then(() => this.react(message, BOT_REACTION_EMOJI));
            }));
          } catch (e) {
            console.error('Error when trying to save a link and react', e);
          }
        }
        if (message.isDirect()) {
          const command = Command.from(message);
          if (command) {
            command.handle(message, { replyOnFinish: true });
          }
        }
      }
    });

    /*
      { type: 'reaction_added',
        user: 'U8S5U2V0R',
        item:
          { type: 'message',
            channel: 'C8SK1H90B',
            ts: '1532036693.000077' },
        reaction: 'rolling_on_the_floor_laughing',
        item_user: 'U8S5U2V0R',
        event_ts: '1532036781.000033',
        ts: '1532036781.000033' }
    */
    this.rtm.on('reaction_added', async (msg) => {
      if (msg.user !== this.id && msg.reaction === USER_FAVORITES_TRIGGER_EMOJI) {
        const reactionsDetails = await this.rtm.webClient.reactions.get({
          channel: msg.item.channel,
          full: true,
          timestamp: msg.item.ts
        });
        if (reactionsDetails.ok) {
          const message = new Message(reactionsDetails.message);
          if (message.hasLinks() && message.author !== this.id) {
            const highlights = await Links.findMatchingLinkIds(message.getLinks(), this.teamId, entry => ({
              _id: entry._id,
              user: msg.user,
              createdAt: new Date()
            }));
            await Highlights.save(highlights);
          }
        }
      }
    });

    /*
      { type: 'reaction_removed',
        user: 'U8S5U2V0R',
        item:
        { type: 'message',
          channel: 'C8SK1H90B',
          ts: '1532036693.000077' },
        reaction: 'rolling_on_the_floor_laughing',
        item_user: 'U8S5U2V0R',
        event_ts: '1532036810.000182',
        ts: '1532036810.000182' }
    */
    this.rtm.on('reaction_removed', async (msg) => {
      if (msg.user !== this.id && msg.reaction === BOT_REACTION_EMOJI) {
        const reactionsDetails = await this.rtm.webClient.reactions.get({
          channel: msg.item.channel,
          full: true,
          timestamp: msg.item.ts
        });
        if (reactionsDetails.ok) {
          const message = new Message(reactionsDetails.message);
          if (message.hasLinks() && message.author !== this.id) {
            const matchedLinks = await Links.findMatchingLinkIds(message.getLinks(), this.teamId, entry => entry._id);
            if (matchedLinks.length) {
              await Highlights.remove(matchedLinks);
            }
          }
        }
      }
    });

    /*
          {
            "type": "member_joined_channel",
            "user": "W06GH7XHN",
            "channel": "C0698JE0H",
            "channel_type": "C",
            "team": "T024BE7LD",
            "inviter": "U123456789"
          }
    */
    this.rtm.on('member_joined_channel', async (msg) => {
      if (msg.user !== this.id) {
        // https://api.slack.com/methods/users.info
        const { ok, user } = await this.rtm.webClient.users.info({ user: msg.user });
        if (ok) {
          await Users.save({
            id: user.id,
            teamId: user.team_id || _.get(user, 'profile.team'),
            name: user.real_name || user.name,
            avatar: _.get(user, 'profile.image_original')
          });
        }
      }
    });

    this.rtm.on('channel_rename', async (msg) => {
      const { id, name } = msg.channel;
      if (this.channels.has(id)) {
        this.channels.get(id).name = name;
        const db = await mongo.connect();
        await db.collection('Links').updateMany(
          { 'channel.id': id },
          {
            $set: {
              'channel.name': name
            }
          }
        );
      }
    });
  }
}

module.exports = Bot;
