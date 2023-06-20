'use strict';

const path = require('node:path');
const process = require('node:process');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const { SERVER_PORT } = process.env;

const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const graphqlResolvers = require('./resolvers');
const graphqlSchema = require('./schema');
const mongoDBConnect = require('../utils/connectDB');

const app = express();

app.all('/graphql', createHandler({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  graphiql: true,
}));

mongoDBConnect()
  .then(() => app.listen(SERVER_PORT, () => console.log(`API GRAPHQL on port: ${SERVER_PORT}`)))
  .catch(console.error);
