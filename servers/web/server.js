'use strict';

const path = require('node:path');
const process = require('node:process');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const { SERVER_PORT_WEB } = process.env;

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');

const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.all('/', (req, res) => res.sendFile(path.join(__dirname, '/www/index.html')));

app.listen(SERVER_PORT_WEB, () => console.log(`SERVER_WEB on port: ${SERVER_PORT_WEB}`));
