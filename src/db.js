const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/.env` });

class DB {
  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
  }

  connectDb(name, username, password, host) {
    return new Sequelize(name, username, password, {
      host: host,
      dialect: 'mysql',
      logging: false,
    });
  }
  getRepository() {
    if (this.environment === 'development') {
      return this.connectDb(
        process.env.DB_NAME,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD,
        process.env.DB_HOST
      );
    } else if (this.environment === 'test') {
      return this.connectDb(
        process.env.TEST_DB_NAME,
        process.env.TEST_DB_USERNAME,
        process.env.TEST_DB_PASSWORD,
        process.env.TEST_DB_HOST
      );
    }
  }

  initDb(sequelize) {
    sequelize
      .sync
      // { force: true }
      ()
      .then(() => console.log(`DB on ${process.env.NODE_ENV}`))
      .catch((err) => console.error(err));
  }
}

module.exports = DB;
