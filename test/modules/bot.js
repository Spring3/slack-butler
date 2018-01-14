const assert = require('assert');
const sinon = require('sinon');
const rewire = require('rewire');

const Bot = rewire('../../src/modules/bot.js');

const BotClass = Bot.Bot;

describe('Bot', () => {
  before(() => {
    const rtm = Bot.__get__('rtm'); // eslint-disable-line
    rtm.start = sinon.spy(rtm, 'start');
  });

  afterEach(() => {
    Bot.__get__('rtm').start.reset(); // eslint-disable-line
  });

  after(() => {
    Bot.__get__('rtm').start.restore(); // eslint-disable-line
  });

  it('should initialize', () => {
    assert.equal(typeof Bot.getInstance, 'function');
    assert.equal(typeof BotClass, 'function');
    const bot = new BotClass({
      id: 'botId',
      name: 'testBot'
    }, []);
    assert.equal(bot.name, 'testBot');
    assert.equal(bot.id, 'botId');
    assert(bot.channels instanceof Map);
    assert.equal(typeof bot.blacklist, 'object');
    assert.equal(typeof bot.react, 'function');
    assert.equal(typeof bot.beginScanningInterval, 'function');
    assert.equal(typeof BotClass.shutdown, 'function');
    assert.equal(typeof BotClass.start, 'function');
    assert.equal(typeof bot.init, 'function');
    assert.equal(Bot.getInstance(), null);
  });

  it('should call start on the slack real-time api', () => {
    BotClass.start();
    assert(Bot.__get__('rtm').start.calledOnce); // eslint-disable-line
  });
});
