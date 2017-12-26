const { MongoClient } = require('mongodb');
const assert = require('assert');
const { mongodb_uri } = require('./configuration.js');

let instance;

function connect() {
  if (!instance) {
    assert(mongodb_uri, 'STARBOT_MONGODB_URI is not given');
    return MongoClient.connect(mongodb_uri).then(connection => instance = connection);
  }
  return Promise.resolve(instance);
}

module.exports = { connect };
