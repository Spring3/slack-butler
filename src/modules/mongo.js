const { MongoClient } = require('mongodb');
const assert = require('assert');
const { mongodbUri } = require('./configuration.js');

let instance;

function connect() {
  if (!instance) {
    assert(mongodbUri, 'STARBOT_MONGODB_URI is not given');
    return MongoClient.connect(mongodbUri).then((connection) => {
      instance = connection;
      return instance;
    });
  }
  return Promise.resolve(instance);
}

function close() {
  if (instance) {
    instance.close();
  }
}

module.exports = { connect, close };
