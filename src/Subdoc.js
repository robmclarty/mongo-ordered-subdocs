'use strict';

const mongoose = require('mongoose');

const subdocSchema = new mongoose.Schema({
  name: String,
  value: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subdoc', subdocSchema);
