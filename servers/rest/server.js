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

<<<<<<< HEAD
app.get('/users', async (req, res) => res.send(getBenchmark(process.hrtime(), await Users.find({}, '_id').exec())));
=======
app.get('/users', async (req, res) => res.send(getBenchmark(process.hrtime(), await Users.find({}).exec())));
>>>>>>> aff9c4f58322eb27a4ebd60e197179e888eda0be

app.get('/', (req, res) => res.send(getBenchmark(process.hrtime(), null)));

mongoDBConnect()
<<<<<<< HEAD
    .then(() => app.listen(SERVER_PORT, () => console.log(`REST API on port: ${SERVER_PORT}`)))
    .catch(console.error);
=======
  .then(() => app.listen(SERVER_PORT_REST, () => console.log(`REST API on port: ${SERVER_PORT_REST}`)))
  .catch(console.error);
>>>>>>> aff9c4f58322eb27a4ebd60e197179e888eda0be

/**
 * Dze
 * @param {number} startTime dd
 * @param {Messages} data dd
 * @returns {Object} La requête demandée + le benchmark
 */
function getBenchmark(startTime, data) {
<<<<<<< HEAD
    return {
        data: data,
        benchmark: {
            RAMALLOWED: process.memoryUsage.rss() + ' octets',
            RAMPOSSIBILITY: process.memoryUsage(),
            CPU: process.cpuUsage(),
            TIME: process.hrtime(startTime)[0] + 's & ' + process.hrtime(startTime)[1] + 'ms'
        },
    }
=======
  return {
    data,
    benchmark: {
      RAMALLOWED: process.memoryUsage.rss(),
      RAMPOSSIBILITY: process.memoryUsage(),
      CPU: process.cpuUsage(),
      TIME: process.hrtime(startTime),
    },
  };
>>>>>>> aff9c4f58322eb27a4ebd60e197179e888eda0be
}
