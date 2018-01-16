const assert = require('assert');
const blacklist = require('../../src/modules/blacklist.js');

describe('Blacklist', () => {
  it('should exist', () => {
    assert.equal(typeof blacklist, 'object');
    assert.equal(typeof blacklist.ban, 'function');
    assert.equal(typeof blacklist.unban, 'function');
    assert.equal(typeof blacklist.getValues, 'function');
  });

  it('should be empty at the beginning', () => {
    assert.deepEqual(blacklist.getValues(), []);
  });

  it('should throw if message is not provided [ban]', () => {
    assert.throws(() => {
      blacklist.ban(null);
    });
    assert.throws(() => {
      blacklist.ban(undefined);
    });
    assert.throws(() => {
      blacklist.ban('');
    });
    assert.throws(() => {
      blacklist.ban(0);
    });
  });

  it('should not include duplicates', () => {
    assert.deepEqual(blacklist.getValues(), []);
    blacklist.ban('test');
    assert.deepEqual(blacklist.getValues(), ['test']);
    blacklist.ban('Test');
    assert.deepEqual(blacklist.getValues(), ['test']);
    blacklist.ban('     test    ');
    assert.deepEqual(blacklist.getValues(), ['test']);
  });

  it('should throw if message is not provided [unban]', () => {
    assert.throws(() => {
      blacklist.unban(null);
    });
    assert.throws(() => {
      blacklist.unban(undefined);
    });
    assert.throws(() => {
      blacklist.unban('');
    });
    assert.throws(() => {
      blacklist.unban(0);
    });
  });

  it('should unban entries', () => {
    assert.deepEqual(blacklist.getValues(), ['test']);
    blacklist.unban('     Test    ');
    assert.deepEqual(blacklist.getValues(), []);
    blacklist.unban('test');
    assert.deepEqual(blacklist.getValues(), []);
  });
});
