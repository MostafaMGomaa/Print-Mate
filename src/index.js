const dotenv = require('dotenv');

const app = require('./app');
const DB = require('./db');
const db = new DB();

dotenv.config({ path: `${__dirname}/.env` });

const PORT = process.env.PORT || 3000;

db.initDb(db.getRepository());

app.listen(PORT, () => console.log(`Server on ${PORT}`));
