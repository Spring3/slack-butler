const assert = require('assert');

const blacklist = new Set();

function ban(text) {
  assert(text);
  blacklist.add(text.toLowerCase().trim());
}

function unban(text) {
  assert(text);
  blacklist.delete(text.toLowerCase().trim());
}

function getValues() {
  return Array.from(blacklist);
}

module.exports = {
  ban,
  unban,
  getValues,
};
