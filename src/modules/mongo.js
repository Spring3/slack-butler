const { MongoClient, ObjectId } = require('mongodb');
const { parse } = require('url');
const assert = require('assert');

let client = null;

assert(process.env.MONGODB_URI, 'MONGODB_URI is undefined');

/**
 * Establish a connection to a remote mongodb database
 * @return {Promise(object)} - promise with a connection
 */
async function connect(url = process.env.MONGODB_URI) {
  if (client === null) {
    client = await MongoClient.connect(url);
    let dbName = parse(url);
    if (!dbName || !dbName.pathname) return Promise.reject(new Error('Malformed connection url'));
    dbName = dbName.pathname.substring(1); // to remove a slash
    return client.db(dbName);
  }
  return Promise.resolve(db);
}

/**
 * Close connection to the database
 * @return {undefined}
 */
function disconnect() {
  console.log('Disconnecting from the database...');
  if (client) {
    client.close();
    console.log('Disconnected from the database');
  }
}

module.exports = { ObjectId, connect, disconnect };
