'use strict';

const { Schema, model } = require('mongoose');

// Le timestamps: true va créer un createdAt et updatedAt automatiquement

const userSchema = new Schema(
  {
    username: String,
    email: String,
    phoneNumber: String,
    avatar: String,
  },
  {
    timestamps: true,
  },
);

module.exports = model('User', userSchema);
