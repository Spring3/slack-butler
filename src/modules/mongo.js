const { MongoClient, ObjectId } = require('mongodb');
const { parse } = require('url');
const assert = require('assert');

let client = null;
let dbName;

assert(process.env.MONGODB_URI, 'MONGODB_URI is undefined');

/**
 * Establish a connection to a remote mongodb database
 * @return {Promise(object)} - promise with a connection
 */
async function connect(url = process.env.MONGODB_URI) {
  if (client === null) {
    client = await MongoClient.connect(url, { useNewUrlParser: true });
    dbName = parse(url);
    if (!dbName || !dbName.pathname) throw new Error('Malformed connection url');
    dbName = dbName.pathname.substring(1); // to remove a slash
    return client.db(dbName);
  }
  return client.db(dbName);
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
