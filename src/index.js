const dotenv = require('dotenv');

const app = require('./app');
const DB = require('./db');

dotenv.config({ path: `${__dirname}/.env` });

const PORT = process.env.PORT || 3000;

const db = new DB();
db.initDb(
  db.getRepository(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    process.env.DB_HOST
  )
);
app.listen(PORT, () => console.log(`Server on ${PORT}`));
