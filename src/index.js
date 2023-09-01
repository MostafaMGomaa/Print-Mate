const dotenv = require('dotenv');

const app = require('./app');
const db = require('./db');

dotenv.config({ path: `${__dirname}/.env` });

const PORT = process.env.PORT || 3000;

db
  .sync
  // { force: true }
  ()
  .then(() => console.log(`DB sync`))
  .catch((err) => console.error(err));

app.listen(PORT, () => console.log(`Server on ${PORT}`));
