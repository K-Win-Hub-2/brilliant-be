"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

let ShareHolderRevenueSchema = new Schema({
  relatedShareHolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shareholders",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  totalRevenue: {
    type: Number,
    required: true,
    default: 0,
  },
  totalGrossProfit: {
    type: Number,
    required: true,
    default: 0,
  },
  expenseAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  remainAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  netProfit: {
    type: Number,
    required: true,
    default: 0,
  },
  remainAmountLimit: {
    type: Number,
    required: true,
    default: 0,
  },

  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  remark: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("ShareHolderRevenue", ShareHolderRevenueSchema);

//Author: Oakar Kyaw
