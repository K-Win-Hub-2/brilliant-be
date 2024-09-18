"use strict";
const Withdraw = require("../models/withdraw");
const WithdrawHistory = require("../models/withdrawHistory");
const ShareRevenue = require("../models/shareholderRevenue");

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

exports.withdrawHistory = async (req, res) => {
  try {
    let result = await WithdrawHistory.find({ isDeleted: false }).populate({
      path: "relatedShareRevenue",
      model: "ShareHolderRevenue",
      populate: {
        path: "relatedShareHolder",
        model: "shareholders",
      },
    });
    // console.log(result, "res");
    let count = await WithdrawHistory.find({ isDeleted: false }).count();
    res.status(200).send({
      success: true,
      count: count,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ error: true, message: "No Record Found!" });
  }
};

exports.withdrawHistoryFilter = async (req, res) => {
  const { shareHolder, startDate, endDate } = req.body;
  try {
    let result = await WithdrawHistory.find({ isDeleted: false }).populate({
      path: "relatedShareRevenue",
      model: "ShareHolderRevenue",
      populate: {
        path: "relatedShareHolder",
        model: "shareholders",
      },
    });
    console.log(
      result.filter(
        (el) => el.relatedShareRevenue?.relatedShareHolder._id === shareHolder
      ),
      "res"
    );
    let count = await WithdrawHistory.find({ isDeleted: false }).count();
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
    console.log(req.body.remainAmount, "req.body.remainAmount");
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
        if (req.body.remainAmount) {
          console.log(req.body.remainAmount, "req.body.remainAmount");
          const newData = {
            remainAmount: req.body.remainAmount,
          };
          const shareRevenue = await ShareRevenue.findOneAndUpdate(
            { _id: req.body.relatedShareRevenue },
            newData,
            { new: true }
          );
          console.log(shareRevenue, "shareRevenue");
          // res.status(200).send({
          //   message: "ShareHolder Revenue update remain success",
          //   success: true,
          //   data: shareRevenue,
          // });
        }
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
          remainAmount: req.body.remainAmount,
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
      if (req.body.remainAmount) {
        console.log(req.body.remainAmount, "req.body.remainAmount");
        const newData = {
          remainAmount: req.body.remainAmount,
        };
        const shareRevenue = await ShareRevenue.findOneAndUpdate(
          { _id: req.body.relatedShareRevenue },
          newData,
          { new: true }
        );
        console.log(shareRevenue, "shareRevenue");
        // res.status(200).send({
        //   message: "ShareHolder Revenue update remain success",
        //   success: true,
        //   data: shareRevenue,
        // });
      }
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
