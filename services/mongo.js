const { MongoClient } = require('mongodb');

let dbInstance;

module.exports = async () => {
  if (!dbInstance) {
    assert(process.env.MONGODB_URI);
    dbInstance = await MongoClient.connect(process.env.MONGODB_URI)
    console.log('Mongodb connection established');
    return dbInstance;
  }
  return dbInstance;
}
