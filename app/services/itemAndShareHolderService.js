"use strict";

const { paginationHelper } = require("../helper/paginationHelper");
const itemAndShareHolder = require("../models/itemAndShareHolder");

exports.getItemAndShareHolders = async (datas) => {
  try {
    let { relatedShareHolder, relatedItem, limit, offset, sort } = datas;
    let query = { isDeleted: false };
    let sortByAscending = { id: 1 };
    relatedShareHolder ? (query.relatedShareHolder = relatedShareHolder) : "";
    relatedItem ? (query.relatedItem = relatedItem) : "";
    if (sort) sortByAscending = { id: -1 };
    let count = await itemAndShareHolder.find(query).count();
    let paginationHelpers = await paginationHelper(count, offset, limit);
    let result = await itemAndShareHolder
      .find(query)
      .populate("relatedShareHolder")
      .limit(paginationHelpers.limit)
      .skip(paginationHelpers.skip)
      .sort(sortByAscending)
      .exec();
    return { data: result, meta_data: paginationHelpers };
  } catch (err) {
    console.log("Error is", err.message);
  }
};

exports.createItemAndShareHolder = async (datas) => {
  try {
    let result = await itemAndShareHolder.create(datas);
    return result;
  } catch (err) {
    console.log("Error is", err.message);
  }
};

exports.getItemAndShareHolderById = async (id) => {
  try {
    let result = await itemAndShareHolder
      .findById(id)
      .populate("relatedShareHolder");
    return result;
  } catch (err) {
    console.log("Error is", err.message);
  }
};

exports.updateItemAndShareHolder = async (id, datas) => {
  try {
    let result = await itemAndShareHolder
      .findByIdAndUpdate(id, datas, {
        new: true,
      })
      .populate("relatedShareHolder");
    return result;
  } catch (err) {
    console.log("Error is", err.message);
  }
};

exports.deleteItemAndShareHolder = async (id) => {
  try {
    let result = await itemAndShareHolder.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    return result;
  } catch (err) {
    console.log("Error is", err.message);
  }
};
