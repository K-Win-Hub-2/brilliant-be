"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

let WithdrawSchema = new Schema({
  relatedShareRevenue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ShareHolderRevenue",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  withdrawDate:{
    type:Date
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
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("Withdraw", WithdrawSchema);

//Author: Oakar Kyaw
