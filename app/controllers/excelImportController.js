"use strict";
const xlsx = require("xlsx");
const items = require("../models/items");
const superCategoryModels = require("../models/superCategory");
const shareHoldersModels = require("../models/shareHolder");
const mongoose = require("mongoose");

exports.excelImport = async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const workSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(workSheet);

    console.log("workSheet", workSheet, "xlsx", xlsx, "data", data);

    for (const result of data) {
      const code = result[0].code;

      if (!code) {
        console.error(`Item not found: ${code}`);
        continue;
      }

      const item_name = result.name;
      const currentQty = result.currentQty;
      // const barcode = result.barcode.split(" (WS)")[0];
      const fromUnit = result.from_unit;
      const toUnit = result.to_unit;
      const purchasePrice = result.purchase_price;
      const sellingPrice = result.selling_price;
      const shareholderName = result.shareholder;
      const title = result.title;
      const superCategoryName = result.superCategory.split(" (WS)")[0];

      const superCategory = await superCategoryModels.findOne({
        name: { $regex: new RegExp(`^${superCategoryName}$`, "i") },
      });

      if (!superCategory) {
        console.error(`SuperCategory not found: ${superCategoryName}`);
        continue;
      }

      let shareholder = await shareHoldersModels.findOne({
        name: { $regex: new RegExp(`^${shareholderName}$`, "i") },
      });

      if (!shareholder && shareholderName) {
        // If shareholder doesn't exist, create a new one
        shareholder = await shareHoldersModels.create({
          name: shareholderName,
        });
      }

      const existingItem = await items.findOne({
        title: title,
        itemName: item_name,
      });

      if (existingItem) {
        await items.updateOne(
          { _id: existingItem._id },
          {
            $set: {
              code: barcode,
              fromUnit: fromUnit,
              toUnit: toUnit,
              totalUnit: (currentQty * toUnit) / fromUnit,
              currentQty: currentQty,
              sellingPrice: sellingPrice,
              purchasePrice: purchasePrice,
              relatedSuperCategory: superCategory._id,
              superCategoryName: superCategoryName,
              "relatedShareHolder.shareholder_id": shareholder
                ? shareholder._id
                : null,
            },
          }
        );
        console.log(`Updated item: ${item_namee}`);
      } else {
        await items.create({
          itemName: item_name,
          code: barcode,
          fromUnit: fromUnit,
          toUnit: toUnit,
          totalUnit: (currentQty * toUnit) / fromUnit,
          currentQty: currentQty,
          sellingPrice: sellingPrice,
          purchasePrice: purchasePrice,
          relatedSuperCategory: superCategory._id,
          superCategoryName: superCategoryName,
          "relatedShareHolder.shareholder_id": shareholder
            ? shareholder._id
            : null,
        });
        console.log(`Created new item: ${item_name}`);
      }

      console.log(
        "this is data of relatedid",
        item_name,
        splitCategory,
        currentQty,
        barcode,
        fromUnit,
        toUnit,
        purchasePrice,
        sellingPrice,
        team,
        other,
        superCategory
      );
    }

    res.status(200).json({ success: true, message: "Import successful" });
  } catch (error) {
    console.error("Error in excelImport", error);
    return res.status(500).send({ error: true, message: error.message });
  }
};

exports.TitleExcelImport = async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const workSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(workSheet);

    for (const result of data) {
      const superCategory = result.superCategory.split(" (WS)")[0];
      const subCategory = result.subCategory.split(" (WS)")[0];
      const brand = result.brand.split(" (WS)")[0];

      const code = result.code;
      const title = result.title;
      const description = result.description;

      const existingTitle = await superCategoryModels.findOne({
        name: title,
        superCategory: superCategory,
        subCategory: subCategory,
      });

      if (existingTitle) {
        await superCategoryModels.updateOne(
          { _id: existingTitle._id },
          {
            $set: {
              code: code,
              description: description,
              brand: brand,
              superCategory: superCategory,
              subCategory: subCategory,
              title: title,
            },
          }
        );
        console.log(`Updated title: ${title}`);
      } else {
        await superCategoryModels.create({
          code: code,
          description: description,
          brand: brand,
          superCategory: superCategory,
          subCategory: subCategory,
          title: title,
        });
        console.log(`Created new title: ${title}`);
      }
    }

    res.status(200).json({ success: true, message: "Import successful" });
  } catch (error) {
    console.error("Error in TitleExcelImport", error);
    return res.status(500).send({ error: true, message: error.message });
  }
};
