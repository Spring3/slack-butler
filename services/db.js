const pg = require('pg-promise')();
const db = pg(process.env.DATABASE_URL);


class Database {
  static init() {
    return db.query('CREATE TABLE IF NOT EXISTS "links"(' +
      '"id" SERIAL PRIMARY KEY,' +
      '"caption" varchar(1024) NOT NULL,' +
      '"link" varchar(1024) NOT NULL UNIQUE);');
  }

  static insert(objArray) {
    const query = objArray.map((linkObj) => {
      return `("${linkObj.caption}", "${linkObj.link}")`;
    }).reduce((sum, current) => {
      return sum.concat(`,${current}`);
    });
    console.log(query);
    let was, is;
    return db.query('SELECT COUNT(*) FROM links;').then((count) => {
      was = count;
      return db.query(`INSERT INTO links (caption, link) VALUES ${query} ON CONFLICT DO NOTHING;`);
    }).then((result) => {
      console.log(result);
    });
  }
}

module.exports = Database;
