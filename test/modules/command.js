const assert = require('assert');
const sinon = require('sinon');
const rewire = require('rewire');
const Bot = require('../../src/modules/bot.js');
const Command = require('../../src/modules/command.js');
const Channel = require('../../src/modules/channel.js');
const blacklist = require('../../src/modules/blacklist.js');

const totalCommand = rewire('../../src/commands/totalCommand.js');
const scanCommand = rewire('../../src/commands/scanCommand.js');
const printCommand = rewire('../../src/commands/printCommand.js');

let toArrayStub = sinon.stub().resolves([]);
let limitStub = sinon.stub().returns({
  toArray: toArrayStub
});
let countStub = sinon.stub().resolves(1);
let findStub = sinon.stub().returns({
  sort: () => ({
    limit: limitStub
  }),
  count: countStub
});
let collectionStub = {
  count: countStub,
  find: findStub
};

const mongodbStub = {
  collection: () => collectionStub
};

describe('Commands', () => {
  afterEach(() => {
    toArrayStub = sinon.stub().resolves([]);
    limitStub = sinon.stub().returns({
      toArray: toArrayStub
    });
    countStub = sinon.stub().resolves(1);
    findStub = sinon.stub().returns({
      sort: () => ({
        limit: limitStub
      }),
      count: countStub
    });
    collectionStub = {
      count: countStub,
      find: findStub
    };
  });

  it('should throw if type of chatMessage is not given', () => {
    assert.throws(() => new Command(null, null));
    assert.throws(() => new Command('help', null));
  });

  it('should contain the execute function', () => {
    const { getHandler } = new Command('help', {});
    assert.equal(typeof getHandler, 'function');
  });

  it('should execute the banCommand', () => {
    const command = new Command('ban', {}).getHandler();
    sinon.stub(command.rtm, 'sendMessage').returns(undefined);
    command.handle('ban test', '123');
    assert(command.rtm.sendMessage.calledOnce); // eslint-disable-line
    assert(blacklist.getValues().includes('test'));
    command.rtm.sendMessage.restore();
  });

  it('should execute blacklistCommand', () => {
    const command = new Command('blacklist', {}).getHandler();
    sinon.stub(command.rtm, 'sendMessage').returns(undefined);
    command.handle('blacklist', {});
    assert(command.rtm.sendMessage.calledOnce);
    command.rtm.sendMessage.restore();
  });

  it('should execute unbanCommand', () => {
    assert(blacklist.getValues().includes('test'));
    const command = new Command('unban', {}).getHandler();
    sinon.stub(command.rtm, 'sendMessage').returns(undefined);
    command.handle('unban something', {});
    assert(command.rtm.sendMessage.calledOnce);
    assert(blacklist.getValues().includes('test'));
    command.handle('unban test', {});
    assert(command.rtm.sendMessage.calledTwice);
    assert(!blacklist.getValues().includes('test'));
    command.rtm.sendMessage.restore();
  });

  it('should execute helpCommand', () => {
    const command = new Command('help', {}).getHandler();
    sinon.stub(command.rtm, 'sendMessage').returns(undefined);
    command.handle('help', {});
    assert(command.rtm.sendMessage.calledTwice);
    command.rtm.sendMessage.restore();
  });

  it('should execute totalCommand', async () => {
    const command = new Command('total', {}).getHandler();
    let mongo = totalCommand.__get__('mongo'); // eslint-disable-line
    sinon.stub(mongo, 'connect').resolves(mongodbStub);
    sinon.stub(command.rtm, 'sendMessage').returns(undefined);
    await command.handle('total', '123abc');
    assert(command.rtm.sendMessage.calledOnce);
    assert(mongo.connect.called);
    mongo.connect.restore();
    command.rtm.sendMessage.restore();
  });

  it('should execute versionCommand', () => {
    const command = new Command('version', {}).getHandler();
    sinon.stub(command.rtm, 'sendMessage').returns(undefined);
    command.handle('version', {});
    assert(command.rtm.sendMessage.calledWith('v2.0-alpha', {}));
    command.rtm.sendMessage.restore();
  });

  it('should execute scanCommand', async () => {
    const stubMessage = {
      channel: new Channel({
        id: 'testId',
        name: 'test'
      }, '123abc')
    };
    stubMessage.channel.fetchMessages = sinon.stub().resolves([]);
    const command = new Command('scan', stubMessage).getHandler();
    let mongo = scanCommand.__get__('mongo'); // eslint-disable-line
    const mongoConnect = mongo.connect;
    sinon.stub(mongo, 'connect').resolves(mongodbStub);
    sinon.stub(command.rtm, 'sendMessage').returns(undefined);
    sinon.stub(Bot, 'getInstance').returns({
      channels: new Map(),
      react: sinon.stub()
    });
    await command.handle('scan', {});
    assert(mongo.connect.called);
    assert(Bot.getInstance.calledOnce);
    assert(stubMessage.channel.fetchMessages.calledOnce);
    assert(!command.rtm.sendMessage.called);
    mongo.connect.restore();
    mongo.connect = mongoConnect;
    Bot.getInstance.restore();
    command.rtm.sendMessage.restore();
  });

  it('should not fail if no enough parameters provided', async () => {
    const command = new Command('print', { author: '123abc' }).getHandler();
    let mongo = printCommand.__get__('mongo'); // eslint-disable-line
    const mongoConnect = mongo.connect;
    mongodbStub.collection = (name) => {
      assert.equal(name, 'Links');
      return collectionStub;
    };
    sinon.stub(mongo, 'connect').resolves(mongodbStub);
    sinon.stub(command.rtm, 'sendMessage').returns(undefined);
    await command.handle('print', {});
    assert(mongo.connect.called);
    assert(command.rtm.sendMessage.calledWith('Unable to process such command', {}));
    mongo.connect.restore();
    mongo.connect = mongoConnect;
    command.rtm.sendMessage.restore();
  });

  it('should execute printCommand with a reserved word', async () => {
    let command = new Command('print', { author: '123abc' }).getHandler();
    let mongo = printCommand.__get__('mongo'); // eslint-disable-line
    const mongoConnect = mongo.connect;
    mongodbStub.collection = (name) => {
      assert.equal(name, 'Links');
      return collectionStub;
    };
    sinon.stub(mongo, 'connect').resolves(mongodbStub);
    sinon.stub(command.rtm, 'sendMessage').returns(undefined);
    await command.handle('print total 3', {});
    assert(mongo.connect.called);
    assert(limitStub.calledWith(3));
    assert(command.rtm.sendMessage.calledOnce);
    mongo.connect.restore();
    command.rtm.sendMessage.restore();

    command = new Command('print', { author: '123abc' }).getHandler();
    sinon.stub(mongo, 'connect').resolves(mongodbStub);
    sinon.stub(command.rtm, 'sendMessage').returns(undefined);
    await command.handle('print last 4', {});
    assert(mongo.connect.called);
    assert(limitStub.calledWith(4));
    assert(command.rtm.sendMessage.calledOnce);
    mongo.connect.restore();
    command.rtm.sendMessage.restore();

    command = new Command('print', { author: '123abc' }).getHandler();
    sinon.stub(mongo, 'connect').resolves(mongodbStub);
    sinon.stub(command.rtm, 'sendMessage').returns(undefined);
    await command.handle('print latest 5', {});
    assert(mongo.connect.called);
    assert(limitStub.calledWith(5));
    assert(command.rtm.sendMessage.calledOnce);
    mongo.connect.restore();
    command.rtm.sendMessage.restore();

    command = new Command('print', { author: '123abc' }).getHandler();
    sinon.stub(mongo, 'connect').resolves(mongodbStub);
    sinon.stub(command.rtm, 'sendMessage').returns(undefined);
    await command.handle('print newest 11', {});
    assert(mongo.connect.called);
    assert(limitStub.calledWith(11));
    assert(command.rtm.sendMessage.calledOnce);
    mongo.connect.restore();
    mongo.connect = mongoConnect;
    command.rtm.sendMessage.restore();
  });

  it('should execute printCommand with default limit', async () => {
    const command = new Command('print', { author: '123abc' }).getHandler();
    let mongo = printCommand.__get__('mongo'); // eslint-disable-line
    const mongoConnect = mongo.connect;
    mongodbStub.collection = (name) => {
      assert.equal(name, 'Links');
      return collectionStub;
    };
    sinon.stub(mongo, 'connect').resolves(mongodbStub);
    sinon.stub(command.rtm, 'sendMessage').returns(undefined);
    await command.handle('print total', {});
    assert(mongo.connect.called);
    assert(limitStub.calledWith(5));
    assert(command.rtm.sendMessage.calledOnce);
    mongo.connect.restore();
    mongo.connect = mongoConnect;
    command.rtm.sendMessage.restore();
  });

  it('should execute printCommand for favorites collection', async () => {
    const command = new Command('print', { author: '123abc' }).getHandler();
    let mongo = printCommand.__get__('mongo'); // eslint-disable-line
    const mongoConnect = mongo.connect;
    mongodbStub.collection = (name) => {
      assert.equal(name, 'Highlights');
      return collectionStub;
    };
    sinon.stub(mongo, 'connect').resolves(mongodbStub);
    sinon.stub(command.rtm, 'sendMessage').returns(undefined);
    await command.handle('print total favorites', {});
    assert(mongo.connect.called);
    assert(limitStub.calledWith(5));
    assert(command.rtm.sendMessage.calledOnce);
    mongo.connect.restore();
    mongo.connect = mongoConnect;
    command.rtm.sendMessage.restore();
  });

  it('should execute printCommand with regex', () => {

  });
});
