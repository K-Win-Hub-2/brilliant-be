"use strict";

const mongoose = require("mongoose");
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;

let ItemSchema = new Schema({
  itemName: {
    type: String,
  },
  code: {
    type: String,
  },
  fromUnit: {
    type: Number,
    required: true,
  },
  toUnit: {
    type: Number,
    required: true,
  },
  totalUnit: {
    type: Number,
    required: true,
  },
  currentQuantity: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sellingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  purchasePrice: {
    type: Number,
    required: true,
    default: 0,
  },
  deliveryPrice: {
    type: Number,
    default: 0,
  },
  reOrderQuantity: {
    type: Number,
    default: 0,
  },
  relatedSuperCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SuperCategories",
  },
  superCategoryName: {
    type: String,
  },
  relatedShareHolder: {
    shareholder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shareholders",
    },
    percent: Number,
  },
  title: {
    type: String,
  },
  relatedItemTitle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ItemTitles",
  },
  description: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("Items", ItemSchema);

//Author: Oakar Kyaw
