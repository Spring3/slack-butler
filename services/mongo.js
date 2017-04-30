const { MongoClient } = require('mongodb');
const assert = require('assert');

async function connect () {
  assert(process.env.MONGODB_URI);
  const dbInstance = await MongoClient.connect(process.env.MONGODB_URI);
  console.log('Mongodb connection established');
  module.exports.instance = dbInstance;
};

module.exports = connect;
