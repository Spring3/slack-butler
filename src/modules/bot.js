const { WebClient, RtmClient, CLIENT_EVENTS } = require('@slack/client');
const {
  autoScanInterval,
  scanTriggerEmoji,
  reactionEmoji,
  favoritesReactionEmoji
} = require('./configuration.js');
const mongo = require('./mongo');
const Links = require('../entities/links.js');
const Highlights = require('../entities/highlights.js');
const Channel = require('./channel');
const blacklist = require('./blacklist');

/**
 * A class of a slack bot
 */
class Bot {
  constructor(team) {
    this.team = team;
    this.id = team.bot.id;
    this.channels = new Map();
    this.blacklist = blacklist;
    this.tokens = {
      bot: team.bot.token,
      user: team.accessToken
    };
    this.rtm = new RtmClient(this.tokens.bot, {
      useRtmConnect: true,
      dataStore: false
    });
    this.web = {
      bot: new WebClient(this.tokens.bot),
      user: new WebClient(this.tokens.user)
    };
    if (autoScanInterval) {
      this.scanningInterval = this.beginScanningInterval();
    }
  }

  /**
   * Put an reaction emoji on the behalf of the bot
   * @param  {ChatMessage} message
   * @param  {string} emoji   - code for the emoji without colon sign (:)
   * @return {Promise}
   */
  async react(message, emoji = reactionEmoji.toLowerCase()) {
    if (!message.isMarked()) {
      try {
        await this.botWeb.reactions.add(emoji, {
          channel: message.channel.id || message.channel,
          timestamp: message.timestamp,
        });
        message.mark();
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
      for (const [id, channel] of this.channels.entries()) { // eslint-disable-line no-unused-vars
        const chatMessage = channel.getMessage({
          type: 'message',
          text: command
        });
        chatMessage.getCommand().getHandler().handle(chatMessage.getDirectMessage(), channel.id);
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
   * Initialize the bot
   * @return {undefined}
   */
  init() {
    this.rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, async (data) => {
      console.log(data);
      if (data.channels) {
        this.channels = new Map(data.channels
          .filter((channel => channel.is_channel && channel.is_member))
          .map(channelData => [channelData.id, new Channel(channelData, this.id)]));
      }
    });

    this.rtm.on(CLIENT_EVENTS.RTM.RAW_MESSAGE, async (msg) => {
      const jsonMessage = JSON.parse(msg);
      if (jsonMessage.channel) {
        const channel = this.channels.get(jsonMessage.channel) || new Channel({ id: jsonMessage.channel }, this.id);
        const message = channel.getMessage(msg);
        if (message.isTextMessage() && message.author !== this.id) {
          if (message.hasLink && message.isMarkedAsFavorite()) {
            Links.save(message);
            if (!message.isMarked()) {
              this.react(message);
            }
          } else {
            const command = message.getCommand();
            if (command) {
              const handler = command.getHandler();
              if (handler) {
                handler.handle(message.getDirectMessage(), message.channel.id, { replyOnFinish: true });
              }
            }
          }
        }
      }
    });

    this.rtm.on('reaction_added', async (msg) => {
      const jsonMessage = typeof msg === 'string' ? JSON.parse(msg) : msg;
      if (!scanTriggerEmoji) return;
      const payload = jsonMessage.item;
      if (
        jsonMessage.reaction === scanTriggerEmoji.toLowerCase()
        && jsonMessage.user !== this.id
        && payload.type === 'message'
      ) {
        const channel = this.channels.get(payload.channel) || new Channel({ id: payload.channel, name: 'DM' }, this.id);
        const message = await channel.fetchMessage(payload.ts);
        if (message.isTextMessage() && message.hasLink) {
          Links.save(message)
            .then(() => Highlights.save(message, jsonMessage.user))
            .then(() => this.react(message, favoritesReactionEmoji.toLowerCase()));
        }
      }
    });

    this.rtm.on('channels_rename', async (msg) => {
      const jsonMessage = typeof msg === 'string' ? JSON.parse(msg) : msg;
      const channelId = jsonMessage.channel.id;
      if (this.channels.has(channelId)) {
        this.channels.get(channelId).name = jsonMessage.channel.name;
        const db = await mongo.connect();
        await db.collection('Links').update(
          { 'channel.id': channelId },
          {
            $set: {
              'channel.name': jsonMessage.channel.name
            }
          },
          { multi: true }
        );
      }
    });

    this.rtm.on('member_joined_channel', async (data) => {
      const memberId = data.user;
      const channelId = data.channel;
      if (this.channels.has(channelId)) {
        // somebody joined a channel
        const channel = this.channels.get(channelId);
        channel.memberJoined(memberId);
        this.rtm.sendMessage(`Welcome to the \`${channel.name}\` channel, <@${memberId}>!`, channelId);
      } else {
        // bot joined a channel
        let channelData = await this.botWeb.channels.info(channelId);
        channelData = typeof channelData === 'string' ? JSON.parse(channelData) : channelData;
        this.channels.set(channelId, new Channel(channelData.channel, this.id));
      }
    });

    this.rtm.on('member_left_channel', (data) => {
      const memberId = data.user;
      const channelId = data.channel;
      if (this.channels.has(channelId)) {
        if (memberId === this.id) {
          // bot left a channel
          this.channels.delete(channelId);
        } else {
          // somebody left a channel
          this.channels.get(channelId).memberLeft(memberId);
        }
      }
    });
  }
}

module.exports.Bot = Bot;
