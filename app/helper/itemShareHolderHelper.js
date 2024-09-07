"use strict"
const { createItemIncome } = require("../services/itemIncomeService")
const Item = require("../models/items")


exports.ItemIncome = async (items, packages, date) => {
    for (const item of items) {
        const { purchasePrice } = await Item.findById(item.item_id)
        const data = {
            relatedItem: item.item_id,
            date: date,
            purchasePrice: Number(purchasePrice) * Number(item.quantity) ,
            quantity: item.quantity,
            amount: Number(item.price) * Number(item.quantity)
        }
        console.log("data", data)
        const Income = await createItemIncome(data)
        console.log("income", Income)
    }
}