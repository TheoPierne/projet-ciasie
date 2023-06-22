'use strict';

const path = require('node:path');
const process = require('node:process');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const pidusage = require('pidusage');

const Messages = require('../models/message');
const Users = require('../models/user');
const mongoDBConnect = require('../utils/connectDB');

const app = express();
const { SERVER_PORT_REST } = process.env;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/messages', async (req, res) =>
  res.send(await getBenchmark(process.hrtime(), await Messages.find({}).exec())),
);

app.get('/messages/:id', async (req, res) =>
  res.send(await getBenchmark(process.hrtime(), await Messages.findById(req.params.id).exec())),
);

app.post('/messages', async (req, res) =>
  res.send(await getBenchmark(process.hrtime(), await Messages.create(req.body))),
);

app.get('/users/:id', async (req, res) =>
  res.send(await getBenchmark(process.hrtime(), await Users.findById(req.params.id).exec())),
);

app.get('/users/:id/messages', async (req, res) =>
  res.send(await getBenchmark(process.hrtime(), await Messages.find({ author: req.params.id }).exec())),
);

app.get('/users', async (req, res) => res.send(await getBenchmark(process.hrtime(), await Users.find({}).exec())));

app.get('/', async (req, res) => res.send(await getBenchmark(process.hrtime(), null)));

mongoDBConnect()
  .then(() => app.listen(SERVER_PORT_REST, () => console.log(`REST API on port: ${SERVER_PORT_REST}`)))
  .catch(console.error);

/**
 * Dze
 * @param {number} startTime dd
 * @param {Messages} data dd
 * @returns {Object} La requête demandée + le benchmark
 */
async function getBenchmark(startTime, data) {
  return {
    data,
    benchmark: {
      RAMALLOWED: process.memoryUsage.rss(),
      RAMPOSSIBILITY: process.memoryUsage(),
      CPU: (await pidusage(process.pid)).cpu,
      TIME: process.hrtime(startTime),
    },
  };
}
