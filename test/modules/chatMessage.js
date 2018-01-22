const assert = require('assert');
const rewire = require('rewire');
const { reactionEmoji } = require('../../src/modules/configuration.js');

let ChatMessage = rewire('../../src/modules/chatMessage.js'); // eslint-disable-line prefer-const

const fixture = {
  type: 'message',
  user: '123abc',
  text: 'test',
  ts: new Date().getTime(),
  channel: 'test'
};

const botStub = {
  id: 'botId'
};

describe('ChatMessage', () => {
  before(() => {
    const bot = ChatMessage.__get__('Bot'); // eslint-disable-line no-underscore-dangle
    this.getBotInstance = bot.getInstance;
    bot.getInstance = () => botStub;
  });

  after(() => {
    ChatMessage.__get__('Bot').getInstance = this.getBotInstance; // eslint-disable-line no-underscore-dangle
  });

  it('should throw if payload is not provided', () => {
    assert.throws(() => {
      new ChatMessage(null, '123abc'); // eslint-disable-line no-new
    });
  });

  it('should take channel form arg', () => {
    const message = new ChatMessage(fixture, '123abc');
    assert.equal(message.channel, '123abc');
  });

  it('should take channel from payload if not provided in args', () => {
    const message = new ChatMessage(fixture);
    assert.equal(message.channel, fixture.channel);
  });

  it('should parse json string if passed as a payload', () => {
    const message = new ChatMessage(JSON.stringify(fixture));
    assert.equal(message.channel, fixture.channel);
    assert.equal(message.type, fixture.type);
    assert.equal(message.subtype, fixture.subtype);
    assert.equal(message.author, fixture.user);
    assert.equal(message.text, fixture.text);
    assert.equal(message.timestamp, fixture.ts);
    assert.deepEqual(message.reactions, fixture.reactions || []);
    assert(!message.hasLink);
    assert(!message.isDirect);
  });

  it('should create a message based on payload and channel', () => {
    const message = new ChatMessage(fixture);
    assert.equal(typeof message.isTextMessage, 'function');
    assert.equal(typeof message.isMarked, 'function');
    assert.equal(typeof message.mark, 'function');
    assert.equal(typeof message.containsLink, 'function');
    assert.equal(typeof message.isDirectMessage, 'function');
    assert.equal(typeof message.getLinks, 'function');
    assert.equal(typeof message.getDirectMessage, 'function');
    assert.equal(typeof message.getCommand, 'function');
    assert.equal(message.channel, fixture.channel);
    assert.equal(message.type, fixture.type);
    assert.equal(message.subtype, fixture.subtype);
    assert.equal(message.author, fixture.user);
    assert.equal(message.text, fixture.text);
    assert.equal(message.timestamp, fixture.ts);
    assert.deepEqual(message.reactions, fixture.reactions || []);
    assert(!message.hasLink);
    assert(!message.isDirect);
  });

  it('should be a testMessage if type = message and no subtype', () => {
    let message = new ChatMessage(fixture);
    assert(message.isTextMessage());
    message = new ChatMessage({ ...fixture, type: 'file' });
    assert(!message.isTextMessage());
    message = new ChatMessage({ ...fixture, subtype: 'snippet' });
    assert(!message.isTextMessage());
  });

  it('should detect if it was marked', () => {
    let message = new ChatMessage(fixture);
    assert(!message.isMarked());
    message = new ChatMessage({
      ...fixture,
      reactions: [{
        name: reactionEmoji,
        users: ['someone']
      }]
    });
    // because no botid among users
    assert(!message.isMarked());
    message = new ChatMessage({
      ...fixture,
      reactions: [{
        name: 'pineapple',
        users: [botStub.id]
      }]
    });
    // because wrong emoji
    assert(!message.isMarked());
    message = new ChatMessage({
      ...fixture,
      reactions: [{
        name: reactionEmoji,
        users: [botStub.id]
      }]
    });
    assert(message.isMarked());
  });

  it('should mark the message only once', () => {
    const message = new ChatMessage(fixture);
    assert.equal(message.reactions.length, 0);
    message.mark();
    assert.equal(message.reactions.length, 1);
    let reactions = message.reactions[0];
    assert.equal(reactions.name, reactionEmoji);
    assert(reactions.users.includes(message.bot.id));
    message.mark();
    assert.equal(message.reactions.length, 1);
    [reactions] = message.reactions;
    assert.equal(reactions.name, reactionEmoji);
    assert.equal(reactions.users.length, 1);
    assert(reactions.users.includes(message.bot.id));
  });

  it('should add bot user to the list of users that already marked the message', () => {
    const message = new ChatMessage({
      ...fixture,
      reactions: [{
        name: reactionEmoji,
        users: ['someone', 'else']
      }]
    });
    message.mark();
    assert.equal(message.reactions.length, 1);
    assert(message.reactions[0].users.includes(message.bot.id));
    message.mark();
    assert.equal(message.reactions.length, 1);
    assert.equal(message.reactions[0].users.length, 3);
  });

  it('should indicate if it contains a link', () => {
    let message = new ChatMessage(fixture);
    assert(message.hasLink === message.containsLink());
    assert.equal(message.hasLink, false);
    message = new ChatMessage({
      ...fixture,
      text: 'https://google.com'
    });
    assert(message.hasLink === message.containsLink());
    assert.equal(message.hasLink, true);
    message = new ChatMessage({
      ...fixture,
      text: 'ftp://some.kinda.weird/link-that-contains-100500-items?with=params&and=123&different=stuff&in=it'
    });
    assert.equal(message.hasLink, true);
    message = new ChatMessage({
      ...fixture,
      text: 'ftp:/link.with.one.slash/'
    });
    assert.equal(message.hasLink, false);
    message = new ChatMessage({
      ...fixture,
      text: 'Hello world \n http://google.com'
    });
    assert.equal(message.hasLink, true);
  });

  it('should indicate if it is a direct message', () => {
    let message = new ChatMessage(fixture);
    assert.equal(message.isDirect, message.isDirectMessage());
    assert.equal(message.isDirect, false);
    message = new ChatMessage({
      ...fixture,
      text: `Hello <@${botStub.id}>`
    });
    assert.equal(message.isDirect, message.isDirectMessage());
    assert.equal(message.isDirect, true);
  });

  it('should get links from the message', () => {
    let message = new ChatMessage(fixture);
    let links = message.getLinks();
    assert.deepEqual(links, []);
    message = new ChatMessage({
      ...fixture,
      text: 'Hello world ftp:/link.with.one.slash/ \nftp://some.kinda.weird/link-that-contains-100500-items?with=params&and=123&different=stuff&in=it \nhttps://google.com \n http://google.com' // eslint-disable-line
    });
    links = message.getLinks();
    assert.equal(links.length, 3);
    assert(!links.filter(l => l.href === 'ftp:/link.with.one.slash/')[0]);
    assert(links.filter(l => l.href === 'ftp://some.kinda.weird/link-that-contains-100500-items?with=params&and=123&different=stuff&in=it')[0]); // eslint-disable-line
    assert(links.filter(l => l.href === 'https://google.com')[0]);
    assert(links.filter(l => l.href === 'http://google.com')[0]);
  });

  it('should get links excluding the ones mentioned in blacklist', () => {
    const blacklist = ChatMessage.__get__('blacklist'); // eslint-disable-line
    assert(blacklist);
    blacklist.ban('google');
    const message = new ChatMessage({
      ...fixture,
      text: 'Hello world ftp:/link.with.one.slash/ \nftp://some.kinda.weird/link-that-contains-100500-items?with=params&and=123&different=stuff&in=it \nhttps://google.com \n http://google.com' // eslint-disable-line
    });
    const links = message.getLinks();
    assert.equal(links.length, 1);
    assert(!links.filter(l => l.href === 'ftp:/link.with.one.slash/')[0]);
    assert(links.filter(l => l.href === 'ftp://some.kinda.weird/link-that-contains-100500-items?with=params&and=123&different=stuff&in=it')[0]); // eslint-disable-line
    assert(!links.filter(l => l.href === 'https://google.com')[0]);
    assert(!links.filter(l => l.href === 'http://google.com')[0]);
  });

  it('should get a direct message', () => {
    let message = new ChatMessage(fixture);
    assert.equal(message.getDirectMessage(), fixture.text.toLowerCase());
    message = new ChatMessage({
      ...fixture,
      text: `Hello world <@${botStub.id}>`
    });
    assert.equal(message.getDirectMessage(), 'hello world');
  });

  it('should convert the message to a command if given', () => {
    let message = new ChatMessage(fixture);
    assert.equal(message.getCommand(), undefined);
    message = new ChatMessage({
      ...fixture,
      text: `Hello world <@${botStub.id}>`
    });
    let command = message.getCommand();
    assert(command !== undefined);
    assert.equal(command.type, 'hello');
    assert(command.chatMessage);
    assert.equal(command.getHandler(), undefined);
    message = new ChatMessage({
      ...fixture,
      text: `help <@${botStub.id}>`
    });
    command = message.getCommand();
    assert(command !== undefined);
    assert.equal(command.type, 'help');
    assert(command.chatMessage);
    assert(typeof command.getHandler() !== 'undefined');
  });
});
