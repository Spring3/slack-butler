const assert = require('assert');
const rewire = require('rewire');
const sinon = require('sinon');

const mongo = rewire('../../src/modules/mongo.js');

describe('MongoDb', () => {
  it('should exist', () => {
    assert.equal(typeof mongo, 'object');
    assert.equal(typeof mongo.connect, 'function');
    assert.equal(typeof mongo.close, 'function');
  });

  it('should connect and close the connection', async () => {
    const mongoClient = mongo.__get__('MongoClient'); // eslint-disable-line
    const close = sinon.stub();
    sinon.stub(mongoClient, 'connect').resolves({ close });
    await mongo.connect();
    assert(mongoClient.connect.calledOnce);
    mongo.close();
    assert(close.calledOnce);
    mongoClient.connect.restore();
  });
});
