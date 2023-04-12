'use strict';

const path = require('node:path');
const process = require('node:process');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
require('../utils/connectDB');
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

app.get('/messages', async (req, res) => {
  const msg = await Messages.find({}, '_id').exec();
  return res.json(msg);
});

app.get('/messages/:id', async (req, res) => {
  const msg = await Messages.findById(req.params.id).exec();
  return res.json(msg);
});

app.get('/user/:id', async (req, res) => {
  const user = await Users.findById(req.params.id).exec();
  return res.json(user);
});

app.get('/user/:id/messages', async (req, res) => {
  const messages = await Messages.find({'author': req.params.id}).exec();
  return res.json(messages);
});

app.listen(SERVER_PORT, () => {
  console.log(`API REST on port: ${SERVER_PORT}`);
});
