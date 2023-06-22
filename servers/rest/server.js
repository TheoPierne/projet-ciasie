'use strict';

const path = require('node:path');
const process = require('node:process');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const Messages = require('../models/message');
const Users = require('../models/user');
const mongoDBConnect = require('../utils/connectDB');
const os = require('os');

const app = express();
const { SERVER_PORT_REST } = process.env;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/messages', async (req, res) => res.send(getBenchmark(process.hrtime(), await Messages.find({}).exec())));

app.get('/messages/:id', async (req, res) =>
  res.send(getBenchmark(process.hrtime(), await Messages.findById(req.params.id).exec())),
);

app.post('/messages', async (req, res) => res.send(getBenchmark(process.hrtime(), await Messages.create(req.body))));

app.get('/users/:id', async (req, res) =>
  res.send(getBenchmark(process.hrtime(), await Users.findById(req.params.id).exec())),
);

app.get('/users/:id/messages', async (req, res) =>
  res.send(getBenchmark(process.hrtime(), await Messages.find({ author: req.params.id }).exec())),
);

app.get('/users', async (req, res) => res.send(getBenchmark(process.hrtime(), await Users.find({}).exec())));

app.get('/', (req, res) => res.send(getBenchmark(process.hrtime(), null)));

mongoDBConnect()
  .then(() => app.listen(SERVER_PORT_REST, () => console.log(`REST API on port: ${SERVER_PORT_REST}`)))
  .catch(console.error);

/**
 * Dze
 * @param {number} startTime dd
 * @param {Messages} data dd
 * @returns {Object} La requête demandée + le benchmark
 */
function getBenchmark(startTime, data) {
  return {
    data,
    benchmark: {
      RAMALLOWED: process.memoryUsage.rss(),
      RAMPOSSIBILITY: process.memoryUsage(),
      CPU: getCpuUsage(),
      TIME: process.hrtime(startTime),
    },
  };
}

function getCpuUsage() {
  const cpuInfo = os.cpus();
  const numCores = cpuInfo.length;

  let totalIdle = 0;
  let totalTick = 0;

  for (let i = 0; i < numCores; i++) {
    const cpu = cpuInfo[i];

    for (let type in cpu.times) {
      totalTick += cpu.times[type];
    }

    totalIdle += cpu.times.idle;
  }

  const idle = totalIdle / numCores;
  const total = totalTick / numCores;

  return (100 - ~~(100 * idle / total));
}