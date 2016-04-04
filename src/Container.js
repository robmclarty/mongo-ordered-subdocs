'use strict';

const mongoose = require('mongoose');
const Subdoc = require('./Subdoc');

const containerSchema = new mongoose.Schema({
  name: String,
  description: String,
  isActive: { type: Boolean, default: true },
  subdocs: [Subdoc.schema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Container', containerSchema);
