'use strict';

const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        _id: ID!
        username: String!
        email: String!
        phoneNumber: String!
        avatar: String!
        createdAt: String!
    }

    type Message {
        _id: ID!
        content: String!
        author: ID!
        createdAt: String!
    }

    input UserInput {
        username: String!
        phoneNumber: String!
        avatar: String!
    }

    input MessageInput {
        content: String!
        author: ID!
    }

    type Query {
        users: [User!]
        user(id: ID): User!
        messages: [Message!]
        message(id: ID): Message!
        messagesByAuthor(id: ID): [Message!]
    }

    type Mutation {
        createUser(user: UserInput): User
        createMessage(message: MessageInput): Message
    }

    schema {
        query: Query
        mutation: Mutation
    }
`);
