'use strict';

const path = require('node:path');
const process = require('node:process');

const { faker } = require('@faker-js/faker');
const { MongoClient, ObjectId } = require('mongodb');

require('dotenv').config({ path: path.resolve(process.cwd(), '../.env') });

const client = new MongoClient(process.env.MONGO_URL_DRIVER);

faker.setLocale('fr');

const users = new Set();
const messages = new Set();

// Génération des utilisateurs
console.time('users');
for (let i = 0; i < 10_000; i++) {
  const firstname = faker.name.firstName();
  const lastname = faker.name.lastName();
  users.add({
    _id: new ObjectId(faker.database.mongodbObjectId()),
    username: faker.internet.userName(firstname, lastname),
    email: faker.internet.email(firstname, lastname),
    phoneNumber: faker.phone.number(),
    avatar: faker.internet.avatar(),
    createdAt: faker.date.past(5),
  });
}
console.timeEnd('users');
console.log(faker.helpers.arrayElement(Array.from(users)));
// Génération des messages
console.time('messages');
for (let u = 0; u < 100_000; u++) {
  messages.add({
    _id: new ObjectId(faker.database.mongodbObjectId()),
    author: faker.helpers.arrayElement(Array.from(users))._id,
    content: faker.lorem.text(),
    createdAt: faker.date.past(5),
  });
}
console.log(faker.helpers.arrayElement(Array.from(messages)));
console.timeEnd('messages');

async function pushToDB() {
  try {
    const database = client.db('app');
    const options = { ordered: true };

    const usersCollection = database.collection('users');
    // Drop de la collection pour éviter d'avoir des problèmes de cohérence avec les IDs
    await usersCollection.deleteMany({});
    await usersCollection.insertMany(Array.from(users), options);

    const messagesCollection = database.collection('messages');
    // Drop de la collection pour éviter d'avoir des problèmes de cohérence avec les IDs
    await messagesCollection.deleteMany({});
    await messagesCollection.insertMany(Array.from(messages), options);
  } finally {
    await client.close();
  }
}

pushToDB()
  .then(() => process.exit(0))
  .catch(console.dir);
