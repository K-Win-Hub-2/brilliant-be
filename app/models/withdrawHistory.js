"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

let WithdrawHistorySchema = new Schema({
  relatedShareRevenue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShareHolderRevenue",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  withdrawDate: {
    type: Date,
  },
  withdrawAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  remainAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  remark: {
    type: String,
  },
  payment: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("WithdrawHistory", WithdrawHistorySchema);

//Author: Oakar Kyaw
