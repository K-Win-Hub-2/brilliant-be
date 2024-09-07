"use strict";

const mongoose = require("mongoose");
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;
const validator = require("validator");

let shareholderSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  nrc_number: {
    type: String,
  },
  dob: {
    type: Date,
  },
  phone_number: {
    type: String,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
  register_date: {
    type: Date,
  },
  position: {
    type: String,
  },
  app_user_flag: {
    type: Boolean,
  },
  related_app_user_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  total_number_product_shared: {
    type: Number,
  },
  related_product_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  avg_share_percent: {
    type: Number,
  },
  max_share_percent: {
    type: Number,
  },
  min_share_percent: {
    type: Number,
  },
  overall_business_share: {
    type: Number,
  },
  capex_flag: {
    type: Boolean,
  },
  total_capex_amount: {
    type: Number,
  },
  workingcap_flag: {
    type: Boolean,
  },
  total_workingcap_amount: {
    type: Number,
  },
  total_product_share_amount: {
    type: Number,
  },
  ROI_percent: {
    type: Number,
  },
  allowed_withdraw_date: {
    type: Date,
  },
  allowed_withdraw_frequency: {
    type: Number,
  },
  allowed_max_withdraw_peramount: {
    type: Number,
  },
  allowed_max_withdraw_totalamount: {
    type: Number,
  },
  total_dividend_accmulated: {
    type: Number,
  },
  total_dividend_withdraw: {
    type: Number,
  },
  total_remain_dividend: {
    type: Number,
  },
  acting_vote_flag: {
    type: Boolean,
    default: false,
  },
  acting_vote_percent: {
    type: Number,
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("shareholders", shareholderSchema);
