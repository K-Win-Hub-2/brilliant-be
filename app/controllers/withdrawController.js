"use strict";
const Withdraw = require("../models/withdraw");
const WithdrawHistory = require("../models/withdrawHistory");

exports.listAllWithdraw = async (req, res) => {
  try {
    let result = await Withdraw.find({ isDeleted: false }).populate(
      "relatedShareHolder"
    );
    // console.log(result, "res");
    let count = await Withdraw.find({ isDeleted: false }).count();
    res.status(200).send({
      success: true,
      count: count,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ error: true, message: "No Record Found!" });
  }
};

exports.getWithdraw = async (req, res) => {
  const result = await Withdraw.find({
    _id: req.params.id,
    isDeleted: false,
  }).populate("relatedShareRevenue");
  if (!result)
    return res.status(500).json({ error: true, message: "No Record Found" });
  return res.status(200).send({ success: true, data: result });
};

exports.createWithdraw = async (req, res, next) => {
  try {
    // console.log(req.body, "req body");
    const check = await Withdraw.find({
      relatedShareRevenue: req.body.relatedShareRevenue,
    });
    console.log(check, "checking");
    if (check[0]) {
      // console.log(check, "checking in if state");
      const firstCheck =
        check[check.length - 1].relatedShareRevenue.netProfit -
          check[check.length - 1].relatedShareRevenue.remainAmountLimit >=
        check[check.length - 1].withdrawAmount;
      if (firstCheck) {
        return res.status(500).send({
          error: true,
          message: "Greater than allowed withdraw amount",
        });
      } else {
        const withdrawHistory = new WithdrawHistory(req.body);
        const withdrawHistoryResult = await withdrawHistory.save();
        console.log(
          check.reduce((acc, curr) => {
            return acc + curr.withdrawAmount;
          }, 0),
          "total"
        );
        const newData = {
          _id: check[check.length - 1]._id,
          relatedShareRevenue: check[check.length - 1].relatedShareRevenue,
          withdrawDate: check[check.length - 1].withdrawDate,
          withdrawAmount:
            check[check.length - 1].withdrawAmount +
            parseInt(req.body.withdrawAmount),
          remainAmount: check.reduce((acc, curr) => {
            acc + curr.remainAmount;
          }, 0),
          remark: check[check.length - 1].remark,
          isDeleted: check[check.length - 1].isDeleted,
          createdAt: check[check.length - 1].createdAt,
        };
        //   const newRevenue = new Withdraw(newData);

        const result = await Withdraw.findOneAndUpdate(
          { _id: check[check.length - 1]._id },
          newData,
          { new: true }
        );
        res.status(200).send({
          message: "Withdraw create success",
          success: true,
          data: result,
        });

        console.log(withdrawHistoryResult, "withdrawHistoryResult");
        res.status(200).send({
          message: "Withdraw History create success",
          success: true,
          data: withdrawHistoryResult,
        });
      }
    } else {
      const withdrawHistory = new WithdrawHistory(req.body);
      const withdrawHistoryResult = await withdrawHistory.save();
      const newRevenue = new Withdraw(req.body);
      const result = await newRevenue.save();
      res.status(200).send({
        message: "Withdraw create success",
        success: true,
        data: result,
      });
    }
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message });
  }
};

exports.updateWithdraw = async (req, res, next) => {
  try {
    const result = await Withdraw.findOneAndUpdate(
      { _id: req.body.id },
      req.body,
      { new: true }
    );
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message });
  }
};

exports.deleteWithdraw = async (req, res, next) => {
  try {
    const result = await Withdraw.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: true },
      { new: true }
    );
    return res
      .status(200)
      .send({ success: true, data: { isDeleted: result.isDeleted } });
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message });
  }
};

exports.activateCategory = async (req, res, next) => {
  try {
    const result = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { isDeleted: false },
      { new: true }
    );
    return res
      .status(200)
      .send({ success: true, data: { isDeleted: result.isDeleted } });
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message });
  }
};
