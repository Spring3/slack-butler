const { MongoClient } = require('mongodb');
const assert = require('assert');
const { mongodbUri } = require('./configuration.js');

let instance;

/**
 * Establish a connection to a remote mongodb database
 * @return {Promise(object)} - promise with a connection
 */
async function connect() {
  if (!instance) {
    if (process.env.NODE_ENV !== 'test') {
      assert(mongodbUri, 'STARBOT_MONGODB_URI is not given');
    }
    instance = await MongoClient.connect(mongodbUri);
    return instance;
  }
  return Promise.resolve(instance);
}

/**
 * Close connection to the database
 * @return {undefined}
 */
function close() {
  if (instance) {
    instance.close();
  }
}

module.exports = { connect, close };
