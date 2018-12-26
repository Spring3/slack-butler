const { WebClient, RTMClient } = require('@slack/client');
const {
  autoScanInterval,
  // scanTriggerEmoji,
  reactionEmoji,
  // favoritesReactionEmoji
} = require('./configuration.js');
const mongo = require('./mongo');
const Message = require('./message.js');
const TeamEntity = require('../entities/team.js');
const Links = require('../entities/links.js');
const Highlights = require('../entities/highlights.js');
const Channel = require('./channel');
const Command = require('./command');

const ignoredEventTypes = ['desktop_notification', 'hello', 'ping', 'pong', undefined];

/**
 * A class of a slack bot
 */
class Bot {
  constructor(data) {
    const { bot = {}, scope, team_id } = data;
    this.token = data.token || bot.bot_access_token;
    this.id = data._id || bot.bot_user_id;
    this.rtm = new RTMClient(this.token);
    this.webClient = new WebClient(this.token);
    this.scopes = data.scopes || (scope || '').split(',');
    this.team = data.teamId || team_id;
    this.blacklist = new Set();
    this.channels = new Map();
    if (autoScanInterval) {
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
      const response = await this.webClient.users.conversations(nextRequsetBody); // eslint-disable-line
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
  async react(message, emoji = reactionEmoji.toLowerCase()) {
    try {
      const res = await this.webClient.reactions.add({
        name: emoji,
        channel: message.channelId,
        timestamp: message.timestamp
      });
      if (!res.ok) {
        console.log('Reaction:', res);
      }
      message.mark();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Starts the automatic scan interval
   * @return {function} - function to stop the interval
   */
  beginScanningInterval() {
    return setInterval(() => {
      const command = `<@${this.id}> scan`;
      for (const [id, channel] of this.channels.entries()) { // eslint-disable-line no-unused-vars
        const chatMessage = channel.getMessage({
          type: 'message',
          text: command
        });
        const botCommand = Command.from(chatMessage);
        if (botCommand) {
          botCommand.handle(chatMessage);
        }
      }
    }, parseInt(autoScanInterval, 10));
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

    this.rtm.on('slack_event', async (type, msg) => {
      if (ignoredEventTypes.includes(type)) {
        return;
      }

      console.log('Type:', type);
      console.log('Message:', msg);
      const channel = this.channels.get(msg.channel || msg.item.channel);
      
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
            { value: 'A place for non-work-related flimflam, faffing, hodge-podge or jibber-jabber you\'d prefer to keep out of more focused work-related channels.',
              creator: 'U8S5U2V0R',
              last_set: 1515975558 },
           previous_names: [],
           priority: 0 } }
       */
      
      /**
       { type: 'member_joined_channel',
        user: 'U8TPTJAET',
        channel: 'GBTTY9WDB',
        channel_type: 'G',
        team: 'T8S5U2UTT',
        inviter: 'U8S5U2V0R',
        event_ts: '1532036290.000320',
        ts: '1532036290.000320' }
       */
      
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
      switch (type) {
        case 'message':
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

          /*
            subtype usually means that this is some sort of a reply to an existing message.
            before an event with subtype gets send, a reply itself is sent as a message event without a subtype
            as the message event with subtype would be a duplicate
          */
          if (!msg.subtype) {
            const message = new Message(msg);
            if (message.hasLinks() && !message.isMarked()) {
              const captionedLinks = message.getLinksData();
              for (const link of captionedLinks) {
                Links.save(Object.assign(link, {
                  author: message.author,
                  channel: channel.name,
                  team: this.team
                })).then(() => {
                  this.react(message, reactionEmoji);
                }).catch(e => console.error('Error when trying to save a link and react', e));
              }
            }
            if (message.isDirect()) {
              const command = Command.from(message);
              if (command) {
                command.handle(message, { replyOnFinish: true });
              }
            }
          }
          // if (msg.channel) {
          //   const channel = this.channels.get(msg.channel);
          // const message = channel.getMessage(msg);
          // if (message.isTextMessage() && message.author !== this.id) {
          //   if (message.hasLink && message.isMarkedAsFavorite()) {
          //     Links.save(message);
          //     if (!message.isMarked()) {
          //       this.react(message);
          //     }
          //   } else {
          //     const command = message.getCommand();
          //     if (command) {
          //       const handler = command.getHandler();
          //       if (handler) {
          //         handler.handle(message.getDirectMessage(), message.channel.id, { replyOnFinish: true });
          //       }
          //     }
          //   }
          // }
          // }
          break;
        case 'reaction_added':
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
          if (msg.user !== this.id && msg.reaction === reactionEmoji) {
            const reactionsDetails = await this.webClient.reactions.get({
              channel: msg.item.channel,
              full: true,
              timestamp: msg.item.ts
            });
            if (reactionsDetails.ok) {
              const message = new Message(reactionsDetails.message);
              if (message.hasLinks()) {
                const db = await mongo.connect();
                const matchedLinks = await db.collection('Links').find({ href: { $in: message.getLinks() } }).toArray();
                const highlights = matchedLinks
                  .map(entry => ({
                    _id: entry._id,
                    user: msg.user,
                    createdAt: new Date()
                  }));
                Highlights.saveAll(highlights);
              }
            }
          }
          break;
        default: {
          break;
        }
      }
    });

    // this.rtm.on('reaction_added', async (msg) => {
    //   const jsonMessage = typeof msg === 'string' ? JSON.parse(msg) : msg;
    //   if (!scanTriggerEmoji) return;
    //   const payload = jsonMessage.item;
    //   if (
    //     jsonMessage.reaction === scanTriggerEmoji.toLowerCase()
    //     && jsonMessage.user !== this.id
    //     && payload.type === 'message'
    //   ) {
    //     const channel = this.channels.get(payload.channel) || new Channel({ id: payload.channel, name: 'DM' }, this.team);
    //     const message = await channel.fetchMessage(payload.ts);
    //     if (message.isTextMessage() && message.hasLink) {
    //       Links.save(message)
    //         .then(() => Highlights.save(message, jsonMessage.user))
    //         .then(() => this.react(message, favoritesReactionEmoji.toLowerCase()));
    //     }
    //   }
    // });

    // this.rtm.on('channels_rename', async (msg) => {
    //   const jsonMessage = typeof msg === 'string' ? JSON.parse(msg) : msg;
    //   const channelId = jsonMessage.channel.id;
    //   if (this.channels.has(channelId)) {
    //     this.channels.get(channelId).name = jsonMessage.channel.name;
    //     const db = await mongo.connect();
    //     await db.collection('Links').update(
    //       { 'channel.id': channelId },
    //       {
    //         $set: {
    //           'channel.name': jsonMessage.channel.name
    //         }
    //       },
    //       { multi: true }
    //     );
    //   }
    // });

    // this.rtm.on('member_joined_channel', async (data) => {
    //   const memberId = data.user;
    //   const channelId = data.channel;
    //   if (this.channels.has(channelId)) {
    //     // somebody joined a channel
    //     const channel = this.channels.get(channelId);
    //     channel.memberJoined(memberId);
    //     this.rtm.sendMessage(`Welcome to the \`${channel.name}\` channel, <@${memberId}>!`, channelId);
    //   } else {
    //     // bot joined a channel
    //     let channelData = await this.web.bot.channels.info(channelId);
    //     channelData = typeof channelData === 'string' ? JSON.parse(channelData) : channelData;
    //     this.channels.set(channelId, new Channel(channelData.channel, this.team));
    //   }
    // });

    // this.rtm.on('member_left_channel', (data) => {
    //   const memberId = data.user;
    //   const channelId = data.channel;
    //   if (this.channels.has(channelId)) {
    //     if (memberId === this.id) {
    //       // bot left a channel
    //       this.channels.delete(channelId);
    //     } else {
    //       // somebody left a channel
    //       this.channels.get(channelId).memberLeft(memberId);
    //     }
    //   }
    // });
  }
}

module.exports = Bot;
