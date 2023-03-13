'use strict';

const { Schema, Types, model } = require('mongoose');

// Le timestamps: true va créer un createdAt et updatedAt automatiquement

const messageSchema = new Schema(
  {
    author: Types.ObjectId,
    content: String,
  },
  {
    timestamps: true,
  },
);

module.exports = model('Message', messageSchema);
