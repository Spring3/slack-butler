const { MongoClient } = require('mongodb');
const assert = require('assert');

let instance;

function connect() {
  if (!instance) {
    assert(process.env.MONGODB_URI, 'MONGODB_URI is not given');
    return MongoClient.connect(process.env.MONGODB_URI)
      .then((connection) => {
        instance = connection;
        return instance;
      });
  }
  return Promise.resolve(instance);
}

module.exports = { connect };
