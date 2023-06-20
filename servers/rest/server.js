'use strict';

const path = require('node:path');
const process = require('node:process');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const app = express();
const { SERVER_PORT } = process.env;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/test', (req, res) => res.json({ a: new Date() }));

app.get('/', (req, res) => {
  let startTime = process.hrtime();

  for (let i = 0; i < 10000000000; i++) {
    // loop test
  }

  return res.json({
    RAMALLOWED: process.memoryUsage.rss() + ' octets',
    RAMPOSSIBILITY: process.memoryUsage(),
    CPU: process.cpuUsage(),
    TIME: process.hrtime(startTime)[0] + 's & ' + process.hrtime(startTime)[1] + 'ms'
  });
});

app.listen(SERVER_PORT, () => {
  console.log(`API REST on port: ${SERVER_PORT}`);
});

