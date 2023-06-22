'use strict';

const path = require('node:path');
const process = require('node:process');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const { SERVER_PORT_GRAPHQL } = process.env;

const cors = require('cors');
const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const graphqlResolvers = require('./resolvers');
const graphqlSchema = require('./schema');
const mongoDBConnect = require('../utils/connectDB');

const app = express();

app.use(cors());

app.all(
  '/graphql',
  createHandler({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  }),
);

mongoDBConnect()
  .then(() => app.listen(SERVER_PORT_GRAPHQL, () => console.log(`API GRAPHQL on port: ${SERVER_PORT_GRAPHQL}`)))
  .catch(console.error);
