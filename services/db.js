const pg = require('pg');

const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  max: process.env.POOL_MAX,
  idleTimeoutMillis: process.env.PGTIMEOUT,
  ssl: true
};
const pool = new pg.Pool(config);
pool.connect((err, client, done) => {
  if (err)
    throw err;
});

class Database {
}

module.exports = Database;
