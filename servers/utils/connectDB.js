'use strict';

const path = require('node:path');
const process = require('node:process');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const mongoose = require('mongoose');
const { MONGO_URL_MONGOOSE } = process.env;

async function connect() {
  try {
    await mongoose.connect(MONGO_URL_MONGOOSE, { useUnifiedTopology: true, useNewUrlParser: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log(error);
  }
}

module.exports = connect;
