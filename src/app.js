const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json());
if (process.env.NODE_ENV === 'prod') app.use(morgan);
module.exports = app;
