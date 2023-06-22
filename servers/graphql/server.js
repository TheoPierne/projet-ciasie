'use strict';

const path = require('node:path');
const process = require('node:process');
const os = require('node:os');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const { SERVER_PORT_GRAPHQL } = process.env;

const cors = require('cors');
const express = require('express');
const graphqlResolvers = require('./resolvers');
const graphqlSchema = require('./schema');
const mongoDBConnect = require('../utils/connectDB');
const { createHandler } = require('../utils/handler');

const app = express();

app.use(cors());

app.all('/graphql', (req, res) => createHandler({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  graphiql: true,
}, getBenchmark)(req, res));

mongoDBConnect()
  .then(() => app.listen(SERVER_PORT_GRAPHQL, () => console.log(`API GRAPHQL on port: ${SERVER_PORT_GRAPHQL}`)))
  .catch(console.error);


/**
* 
* @param {number} startTime 
* @param {} data 
* @returns La requête demandée + le benchmark
*/
function getBenchmark(startTime) {
  return {
    RAMALLOWED: process.memoryUsage.rss(),
    RAMPOSSIBILITY: process.memoryUsage(),
    CPU: getCpuUsage(),
    TIME: process.hrtime(startTime)
  }
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