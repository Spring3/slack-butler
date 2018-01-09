const assert = require('assert');

const { getTitles } = require('../../src/utils/url.js');

describe('Utility tests', () => {
  it('should exist', () => {
    assert.equal(typeof getTitles, 'function');
  });

  it('should process null/undefined', () => {
    const results = [
      getTitles(null),
      getTitles(undefined)
    ];
    for (const result of results) {
      assert(Array.isArray(result));
      assert.equal(result.length, 0);
    }
  });

  it('should process a single link as string', () => {
    const link = 'https://google.com/hello-world';
    const result = getTitles(link);
    assert(Array.isArray(result));
    const linkInfo = result[0];
    assert(linkInfo);
    assert.equal(linkInfo.caption, 'Hello world');
    assert.equal(linkInfo.href, link);
  });

  it('should process an array of links', () => {
    const expectedResults = [
      'Hello world',
      'Hello world 1',
      'Hello world 2',
      ''
    ];
    const links = [
      'https://google.com/hello-world',
      'https://google.com/hello-world-1?s=123abc',
      'https://google.com/hello-world-2/',
      'https://google.com/'
    ];
    const results = getTitles(links);
    assert(Array.isArray(results));
    for (let i = 0; i < results.length; i++) {
      assert.equal(results[i].caption, expectedResults[i]);
    }
  });
});
