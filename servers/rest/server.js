'use strict';

const path = require('node:path');
const process = require('node:process');

require('dotenv').config({ path: path.resolve(process.cwd(), '../../.env') });

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const app = express();
const { SERVER_PORT } = process.env;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/test', (req, res) => res.json({ a: new Date() }));

app.listen(SERVER_PORT, () => {
  console.log(`API REST on port: ${SERVER_PORT}`);
});
