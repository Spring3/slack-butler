const pg = require('pg-promise')();
const db = pg(process.env.DATABASE_URL);


class Database {
  static init() {
    return db.query('CREATE TABLE IF NOT EXISTS "links"(' +
      '"id" SERIAL PRIMARY KEY,' +
      '"caption" varchar (256) NOT NULL,' +
      '"link" TEXT NOT NULL UNIQUE);');
  }

  static insert(objArray) {
    const query = objArray.map((linkObj) => {
      return `('${linkObj.caption}', '${linkObj.link}')`;
    }).reduce((sum, current) => {
      return sum.concat(`,${current}`);
    });
    let insertedAmount;
    return db.query('SELECT COUNT(*) FROM links;').then((result) => {
      insertedAmount = parseInt(result[0].count, 10);
      return db.query(`INSERT INTO links (caption, link) VALUES ${query} ON CONFLICT DO NOTHING;`);
    }).then((result) => {
      return db.query('SElECT COUNT(*) FROM links;');
    }).then((result) => {
      insertedAmount = parseInt(result[0].count, 10) - insertedAmount;
      return insertedAmount;
    });
  }

  static getTotalLinks() {
    return db.query('SELECT COUNT(*) FROM links;').then((result) => {
      return parseInt(result[0].count, 10);
    });
  }

  static getLinks(limit, offset = 0) {
    let query = 'SELECT caption, link FROM links';
    if (limit) {
      query += ` LIMIT ${limit}`;
    }
    console.log(offset);
    query += ` OFFSET ${offset};`;
    return db.many(query).then((result) => { 
      return result.map((item) => {
        return `[${item.caption}] - ${item.link}`;
      }).join('\n');
    });
  }
}

module.exports = Database;
