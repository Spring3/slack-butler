const assert = require('assert');
const sinon = require('sinon');
const rewire = require('rewire');
const Bot = require('../../src/modules/bot.js');
const Command = require('../../src/modules/command.js');
const Channel = require('../../src/modules/channel.js');
const blacklist = require('../../src/modules/blacklist.js');

const totalCommand = rewire('../../src/modules/commands/totalCommand.js');
const scanCommand = rewire('../../src/modules/commands/scanCommand.js');

const mongodbStub = {
  collection: () => ({
    count: sinon.stub.resolves(1),
    find: () => ({
      count: sinon.stub.resolves(1)
    })
  })
};

describe('Commands', () => {
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
    assert(command.rtm.sendMessage.calledWith(`[feature/polishing, wip] v${process.env.npm_package_version}`), {});
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
});
