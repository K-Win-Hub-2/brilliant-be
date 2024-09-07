"use strict"

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;


let ItemIncomeSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  date: {
    type: Date,
    required: true
  },
  relatedItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Items'
  },
  purchasePrice: {
    type: Number,
    required: true,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = mongoose.model('ItemIncomes', ItemIncomeSchema);

//Author: Oakar Kyaw
