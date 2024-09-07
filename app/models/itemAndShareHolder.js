'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;


let ItemPackageSchema = new Schema({
  relatedShareHolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shareholders"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  percent: {
    type: Number,
    required: true,
    default: 0
  },
  relatedItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Items'
  },
  description: {
    type: String
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = mongoose.model('ItemAndShareHolders', ItemPackageSchema);

//Author: Oakar Kyaw
