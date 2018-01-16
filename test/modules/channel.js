const assert = require('assert');
const sinon = require('sinon');
const rewire = require('rewire');

const Channel = rewire('../../src/modules/channel.js');
const ChatMessage = rewire('../../src/modules/chatMessage.js');

const fixture = {
  id: '123abc',
  name: 'test'
};

const messageFixture = {
  type: 'message',
  user: '123abc',
  text: 'test',
  ts: new Date().getTime(),
  channel: 'test'
};

describe('Channel', () => {
  it('should throw if data or botId was not provided', () => {
    assert.throws(() => {
      new Channel(null, '123abc'); // eslint-disable-line
    });

    assert.throws(() => {
      new Channel({ id: 'test', name: 'testChannel' }, null); // eslint-disable-line
    });
  });

  it('should intiailize', () => {
    const channel = new Channel(fixture, 'botId');
    assert.equal(channel.botId, 'botId');
    assert.equal(channel.id, fixture.id);
    assert.equal(channel.name, fixture.name);
    assert(channel.members instanceof Set);
    assert.deepEqual(Array.from(channel.members), []);
    assert.equal(typeof channel.fetchMessages, 'function');
    assert.equal(typeof channel.fetchMessage, 'function');
    assert.equal(typeof channel.memberJoined, 'function');
    assert.equal(typeof channel.memberLeft, 'function');
    assert.equal(typeof channel.getMessage, 'function');
  });

  it('should take members during the initialization if provided', () => {
    const data = Object.assign({}, fixture, {
      members: ['user-1', 'user-2']
    });
    const channel = new Channel(data, 'botId');
    assert.deepEqual(Array.from(channel.members), data.members);
  });

  it('should add members without duplicates if provided', () => {
    const channel = new Channel(fixture, 'botId');
    assert.deepEqual(Array.from(channel.members), []);
    channel.memberJoined('test-1');
    assert.deepEqual(Array.from(channel.members), ['test-1']);
    channel.memberJoined(null);
    assert.deepEqual(Array.from(channel.members), ['test-1']);
    channel.memberJoined('test-1');
    assert.deepEqual(Array.from(channel.members), ['test-1']);
  });

  it('should remove member if joined', () => {
    const channel = new Channel(fixture, 'botId');
    assert.deepEqual(Array.from(channel.members), []);
    channel.memberJoined('test-1');
    assert.deepEqual(Array.from(channel.members), ['test-1']);
    channel.memberLeft('test-2');
    assert.deepEqual(Array.from(channel.members), ['test-1']);
    channel.memberLeft(undefined);
    assert.deepEqual(Array.from(channel.members), ['test-1']);
    channel.memberLeft('test-1');
    assert.deepEqual(Array.from(channel.members), []);
  });

  it('should construct a message bound to this channel', () => {
    let Bot = ChatMessage.__get__('Bot'); // eslint-disable-line
    sinon.stub(Bot, 'getInstance').returns({ id: 'test' });
    const channel = new Channel(fixture, 'botId');
    const message = channel.getMessage(messageFixture);
    assert.equal(message.channel.id, channel.id);
    Bot.getInstance.restore();
  });

  it('should fetch one message via slack web api', async () => {
    let userWeb = Channel.__get__('userWeb'); // eslint-disable-line
    const { conversations } = userWeb;
    userWeb.conversations = {
      history: sinon.stub().resolves({ messages: [messageFixture] })
    };
    let Bot = ChatMessage.__get__('Bot'); // eslint-disable-line
    sinon.stub(Bot, 'getInstance').returns({ id: 'test' });
    const channel = new Channel(fixture, 'botId');
    const message = await channel.fetchMessage(messageFixture.ts);
    assert(message);
    assert.equal(message.type, messageFixture.type);
    assert.equal(message.author, messageFixture.user);
    assert.equal(message.text, messageFixture.text);
    assert.equal(message.timestamp, messageFixture.ts);
    assert.equal(message.channel.id, channel.id);
    userWeb.conversations = conversations;
    Bot.getInstance.restore();
  });

  it('should fetch many messages via slack web api', async () => {
    let userWeb = Channel.__get__('userWeb'); // eslint-disable-line
    const { conversations } = userWeb;
    let calls = 0;
    userWeb.conversations = {
      history: () => {
        if (calls < 3) {
          calls++;
          return {
            messages: [messageFixture, messageFixture, messageFixture],
            has_more: true,
            response_metadata: {
              next_cursor: 'test'
            }
          };
        }
        return { messages: [messageFixture, messageFixture, messageFixture] };
      }
    };
    let Bot = ChatMessage.__get__('Bot'); // eslint-disable-line
    sinon.stub(Bot, 'getInstance').returns({ id: 'test' });
    const channel = new Channel(fixture, 'botId');
    const messages = await channel.fetchMessages();
    assert(Array.isArray(messages));
    for (const message of messages) {
      assert.equal(message.type, messageFixture.type);
      assert.equal(message.author, messageFixture.user);
      assert.equal(message.text, messageFixture.text);
      assert.equal(message.timestamp, messageFixture.ts);
      assert.equal(message.channel.id, channel.id);
    }
    userWeb.conversations = conversations;
    Bot.getInstance.restore();
  });
});
