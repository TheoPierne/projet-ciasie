'use strict';

const path = require('node:path');
const process = require('node:process');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
const mongoDBConnect = require('../utils/connectDB');
const Messages = require('../models/message');
const Users = require('../models/user');

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const app = express();
const { SERVER_PORT } = process.env;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/messages', async (req, res) => res.send(getBenchmark(process.hrtime(), await Messages.find({}, '_id').exec())));

app.get('/messages/:id', async (req, res) => res.send(getBenchmark(process.hrtime(), await Messages.findById(req.params.id).exec())));

app.post('/message', async (req, res) => res.send(getBenchmark(process.hrtime(), await Messages.create(req.body))));

app.get('/user/:id', async (req, res) => res.send(getBenchmark(process.hrtime(), await Users.findById(req.params.id).exec())));

app.get('/user/:id/messages', async (req, res) => res.send(getBenchmark(process.hrtime(), await Messages.find({ 'author': req.params.id }).exec())));

app.get('/user', async (req, res) => res.send(getBenchmark(process.hrtime(), await Users.find({}, '_id').exec())));

app.get('/', (req, res) => res.send(getBenchmark(process.hrtime(), null)));

mongoDBConnect()
  .then(() => app.listen(SERVER_PORT, () => console.log(`REST API on port: ${SERVER_PORT}`)))
  .catch(console.error);

/**
 * 
 * @param {Int} startTime 
 * @param {Messaeges} data 
 * @returns La requête demandée + le benchmark
 */
function getBenchmark(startTime, data) {
  return {
    data: data,
    benchmark: {
      RAMALLOWED: process.memoryUsage.rss() + ' octets',
      RAMPOSSIBILITY: process.memoryUsage(),
      CPU: process.cpuUsage(),
      TIME: process.hrtime(startTime)[0] + 's & ' + process.hrtime(startTime)[1] + 'ms'
    },
  }
}
