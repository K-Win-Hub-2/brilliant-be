"use strict";
const ShareRevenue = require("../models/shareholderRevenue");

exports.listAllShareRevenue = async (req, res) => {
  try {
    let result = await ShareRevenue.find({ isDeleted: false }).populate('relatedShareHolder');
    console.log(result, "res");
    let count = await ShareRevenue.find({ isDeleted: false }).count();
    res.status(200).send({
      success: true,
      count: count,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ error: true, message: "No Record Found!" });
  }
};

exports.getShareRevenue = async (req, res) => {
  const result = await ShareRevenue.find({
    _id: req.params.id,
    isDeleted: false,
  });
  if (!result)
    return res.status(500).json({ error: true, message: "No Record Found" });
  return res.status(200).send({ success: true, data: result });
};

exports.createShareRevenue = async (req, res, next) => {
  try {
    const newRevenue = new ShareRevenue(req.body);
    const result = await newRevenue.save();
    res.status(200).send({
      message: "Shareholder Revenue create success",
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message });
  }
};

exports.updateShareRevenue = async (req, res, next) => {
  try {
    const result = await ShareRevenue.findOneAndUpdate(
      { _id: req.body.id },
      req.body,
      { new: true }
    );
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message });
  }
};

exports.deleteShareRevenue = async (req, res, next) => {
  try {
    const result = await ShareRevenue.findOneAndUpdate(
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
