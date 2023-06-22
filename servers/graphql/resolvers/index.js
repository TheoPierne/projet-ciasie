'use strict';

const Message = require('../../models/message');
const User = require('../../models/user');

let startTime = process.hrtime();

module.exports = {

  users: async () => {
    let usersFetched = [];
    try {
      usersFetched = await User.find();
    } catch (err) {
      console.error(err);
    }

    return usersFetched;
  },

  user: async args => {
    const { id } = args;
    let user = null;
    try {
      user = await User.findById(id);
    } catch (err) {
      console.error(err);
    }

    return user;
  },

  createUser: async args => {
    let newUser = null;
    try {
      const { username, email, phoneNumber, avatar } = args.user;
      const user = new User({ username, email, phoneNumber, avatar });
      newUser = await user.save();
    } catch (err) {
      console.error(err);
    }

    return newUser;
  },

  messages: async () => {
    let messages = [];
    try {
      messages = await Message.find();
    } catch (err) {
      console.error(err);
    }

    return messages;
  },

  message: async args => {
    const { id } = args;
    let message = null;
    try {
      message = await Message.findById(id);
    } catch (err) {
      console.error(err);
    }

    return message;
  },
};
