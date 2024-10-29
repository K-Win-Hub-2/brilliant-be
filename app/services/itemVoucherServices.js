"use strict";
const {
  substractCurrentQuantityOfItem,
  substractCurrentQuantityOfItemPackageArray,
  addItemsArrayifPurchase,
  addCurrentQuantityPackageArray,
} = require("../helper/checkItems");
const { ItemIncome } = require("../helper/itemShareHolderHelper");
const { paginationHelper } = require("../helper/paginationHelper");
const { generateVoucherCode } = require("../helper/voucherCodeGeneratorHelper");
const itemVoucher = require("../models/itemVoucher");
const { createDebt } = require("./debtService");
const AccountList = require("../models/accountingList");
const Items = require("../models/items");
const moment = require("moment-timezone");

exports.getAllItemVoucher = async (datas) => {
  let {
    bank,
    cash,
    secondAccount,
    isDouble,
    secondAmount,
    startDate,
    endDate,
    refund,
    refundType,
    refundDate,
    refundAccount,
    paymentMethod,
    code,
    relatedBank,
    relatedCash,
    relatedPackage,
    relatedItem,
    paymentType,
    secondPaymentType,
    relatedBranch,
    createdBy,
    balance,
    tsType,
    exact,
    limit,
    offset,
    sort,
  } = datas;
  let sortByAscending = { id: 1 };
  let query = {
    isDeleted: false,
  };
  if (startDate && endDate) {
    query.createdAt = {
      $gte: moment.tz(startDate, "Asia/Yangon").startOf("day").format(),
      $lte: moment.tz(endDate, "Asia/Yangon").startOf("day").format(),
    };
  }
  if (exact) {
    query.createdAt = {
      $gte: moment.tz(startDate, "Asia/Yangon").startOf("day").format(),
      $lt: moment.tz(endDate, "Asia/Yangon").startOf("day").format(),
    };
  }
  if (refund) query.refund = refund;

  if (!refundType) query.refund = false;

  if (refundType) query.refundType = refundType;

  if (refundDate)
    query.refundDate = {
      $gte: new Date(refundDate),
    };

  if (refundAccount) query.refundAccount = refundAccount;

  if (paymentMethod) query.paymentMethod = paymentMethod;

  if (code) query.code = code;

  if (relatedBank) query.relatedBank = relatedBank;

  if (relatedCash) query.relatedCash = relatedCash;

  if (paymentType) query.paymentType = paymentType;

  if (secondPaymentType) query.secondPaymentType = secondPaymentType;

  if (relatedBranch) query.relatedBranch = relatedBranch;

  if (createdBy) query.createdBy = createdBy;

  if (balance)
    query.balance = {
      $exists: true,
    };

  if (tsType) query.tsType = tsType;

  if (isDouble) query.isDouble = isDouble;

  if (secondAccount) query.secondAccount = secondAccount;

  if (secondAmount)
    query.secondAmount = {
      $gte: secondAmount,
    };

  if (bank) query.relatedBank = { $exists: true };

  if (cash) query.relatedCash = { $exists: true };

  if (relatedPackage)
    query.relatedPackage = { $exists: true, $not: { $size: 0 } };
  if (relatedItem) query.relatedItem = { $exists: true, $not: { $size: 0 } };
  if (sort) sortByAscending = { id: -1 };
  let count = await itemVoucher.find(query).count();
  let paginationHelpers = await paginationHelper(count, offset, limit);
  let result = await itemVoucher
    .find(query)
    .limit(paginationHelpers.limit)
    .skip(paginationHelpers.skip)
    .sort(sortByAscending)
    .populate(
      "relatedBank relatedCash relatedItem.item_id relatedPackage.item_id relatedCustomer"
    )
    .populate({ path: "secondAccount", populate: { path: "relatedHeader" } })
    .exec();
  return { data: result, meta_data: paginationHelpers };
};

exports.createItemVoucher = async (datas) => {
  console.log(datas, "datas");
  const additionalData = await generateVoucherCode();
  datas.code = additionalData.code;
  datas.seq = additionalData.seq;
  await substractCurrentQuantityOfItem(datas.relatedItem);
  await substractCurrentQuantityOfItemPackageArray(datas.relatedPackage);
  await ItemIncome(datas.relatedItem, datas.relatedPackage, datas.createdAt);

  if (datas.relatedCash) {
    const Acc = await AccountList.findById(datas.relatedCash);
    console.log(Acc, "Acc");
    await AccountList.findByIdAndUpdate(
      datas.relatedCash,
      {
        amount: parseInt(Acc.amount) + parseInt(datas.totalPaidAmount),
      },
      { new: true }
    );
  } else {
    const Acc = await AccountList.findById(datas.relatedBank);
    console.log(Acc, "Accsdddfasfsfasd");
    await AccountList.findByIdAndUpdate(
      datas.relatedBank,
      {
        amount: parseInt(Acc.amount) + parseInt(datas.totalPaidAmount),
      },
      { new: true }
    );
  }

  const resultTeamArray = await Items.find({
    _id: {
      $in: datas.relatedItem.map((i) => i.item_id),
    },
    "relatedShareHolder.shareholder_id": "66e047a90718e97089ca7d83",
  });
  const resultOtherArray = await Items.find({
    _id: {
      $in: datas.relatedItem.map((i) => i.item_id),
    },
    "relatedShareHolder.shareholder_id": "66e047f90718e97089ca7d8f",
  });
  console.log(resultTeamArray, "resultTeamArray");
  console.log(resultOtherArray, "resultOtherArray");

  if (resultTeamArray[0]) {
    const filterToIncreaseAmount = datas.relatedItem.filter((el) =>
      resultTeamArray.map((i) => i._id === el.item_id)
    );


    // console.log(filterToIncreaseAmount, "filterToIncreaseAmount");
    const SumTeamAmount = filterToIncreaseAmount.reduce((a, b) => a + ((b.price * b.quantity) - b.discount), 0)
    // console.log(SumTeamAmount, "filterToIncreaseAmount");

    const findID = await AccountList.findOne({ subHeader: "Team" });
    const finalForTeam = await AccountList.findByIdAndUpdate(
      findID._id,
      {
        amount: parseInt(findID.amount) + parseInt(SumTeamAmount),
      },
      { new: true }
    );
      // console.log(finalForTeam, "finalForTeam");
  } else {
    const filterToIncreaseAmount = datas.relatedItem.filter((el) =>
      resultOtherArray.map((i) => i._id === el.item_id)
    );

    // console.log(filterToIncreaseAmount, "filterToIncreaseAmount");
    const SumOtherAmount = filterToIncreaseAmount.reduce(
      (a, b) => a + (b.price * b.quantity - b.discount),
      0
    );
    // console.log(SumTeamAmount, "filterToIncreaseAmount");

    const findID = await AccountList.findOne({ subHeader: "Other" });
    const finalForOther = await AccountList.findByIdAndUpdate(
      findID._id,
      {
        amount: parseInt(findID.amount) + parseInt(SumOtherAmount),
      },
      { new: true }
    );
    // console.log(finalForOther, "finalForTeam");
  }
  // const resultArray = multiItem ? [multiItem] : [];

  // const searchTeam = resultArray.filter(
  //   (el) => el.relatedShareHolder.shareholder_id === "66e047a90718e97089ca7d83"
  // );
  // console.log(searchTeam, "searchTeam");
  // const checkItems = searchTeam.filter((el) => el._id === item.item_id);
  // console.log(checkItems, "checkItems");
  // const data = {
  //     relatedItem: item.item_id,
  //     date: date,
  //     purchasePrice: Number(purchasePrice) * Number(item.quantity) ,
  //     quantity: item.quantity,
  //     amount: Number(item.price) * Number(item.quantity)
  // }
  // console.log("data", data)

  let result = await itemVoucher.create(datas);
  // creating debt if balance exist
  if (datas.balance)
    await createDebt({
      relatedItemVoucher: result._id,
      date: datas.createdAt,
      balance: datas.balance,
      isPaid: false,
    });

  return result;
};

exports.getItemVoucherById = async (id) => {
  let result = await itemVoucher
    .findById(id)
    .populate("relatedSuperCategory relatedItemTitle relatedCustomer");
  return result;
};

exports.updateItemVoucher = async (id, datas) => {
  let itemVoucher = await this.getItemVoucherById(id);
  const relatedPackage = itemVoucher.relatedPackage;
  const relatedItem = itemVoucher.relatedItem;
  if (datas.relatedItem.length > 0) {
    await substractCurrentQuantityOfItem(relatedItem);
    await addItemsArrayifPurchase(datas.relatedItem);
    await itemVoucher.findByIdAndUpdate(id, { $unset: { relatedItem: "" } });
  }
  if (datas.relatedPackage.length > 0) {
    await substractCurrentQuantityOfItemPackageArray(relatedPackage);
    await addCurrentQuantityPackageArray(datas.relatedPackage);
    await itemVoucher.findByIdAndUpdate(id, { $unset: { relatedPackage: "" } });
  }

  let result = await itemVoucher.findByIdAndUpdate(id, datas, { new: true });
  return result;
};

exports.deleteItemVoucher = async (id) => {
  let result = await itemVoucher.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    { new: true }
  );
  return result;
};
