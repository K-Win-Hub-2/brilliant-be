"use strict";

const { startDateEndDateHelper } = require("../helper/dateHelper");
const { paginationHelper } = require("../helper/paginationHelper");
const itemIncomeTotal = require("../models/itemIncomeTotal");
const itemAndShareHolder = require("../models/itemAndShareHolder");
exports.getItemIncome = async (datas) => {
  try {
    let { relatedItem, limit, offset, sort } = datas;
    let query = { isDeleted: false };
    let sortByAscending = { id: 1 };
    relatedItem ? (query.relatedItem = relatedItem) : "";
    if (sort) sortByAscending = { id: -1 };
    let count = await itemIncomeTotal.find(query).count();
    let paginationHelpers = await paginationHelper(count, offset, limit);
    let result = await itemIncomeTotal
      .find(query)
      .limit(paginationHelpers.limit)
      .skip(paginationHelpers.skip)
      .sort(sortByAscending)
      .exec();
    return { data: result, meta_data: paginationHelpers };
  } catch (err) {
    console.log("Error is", err.message);
  }
};

exports.createItemIncome = async (datas) => {
  try {
    let result;
    const { relatedItem, date } = datas;
    let query = { isDeleted: false };
    query.relatedItem = relatedItem;
    let dateHelper = startDateEndDateHelper({ exact: date, value: "add" });
    query.date = { $gte: dateHelper.startDate, $lte: dateHelper.endDate };
    let searchIncome = await itemIncomeTotal.findOne(query);
    console.log("sree", searchIncome, datas);
    if (searchIncome) {
      result = await itemIncomeTotal.findByIdAndUpdate(
        searchIncome._id,
        {
          $inc: {
            quantity: datas.quantity,
            amount: datas.amount,
            purchasePrice: datas.purchasePrice,
          },
        },
        { new: true }
      );
    } else {
      result = await itemIncomeTotal.create(datas);
    }
    console.log(result, "res");
    //   const newIAS = {
    //       relatedShareHolder:,
    //       percent:,
    //       relatedItem:,
    //   }
    // let resultItemAndShare = await itemAndShareHolder.create(datas);
    return result;
  } catch (err) {
    console.log("Error is", err.message);
  }
};

exports.getitemIncomeTotalById = async (id) => {
  try {
    let result = await itemIncomeTotal.findById(id);
    return result;
  } catch (err) {
    console.log("Error is", err.message);
  }
};

exports.updateitemIncomeTotal = async (id, datas) => {
  try {
    let result = await itemIncomeTotal.findByIdAndUpdate(id, datas, {
      new: true,
    });
    return result;
  } catch (err) {
    console.log("Error is", err.message);
  }
};

exports.deleteitemIncomeTotal = async (id) => {
  try {
    let result = await itemIncomeTotal.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    return result;
  } catch (err) {
    console.log("Error is", err.message);
  }
};
