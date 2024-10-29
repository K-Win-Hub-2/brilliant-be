"use strict"
const itemAndShareHolder = require("../models/itemAndShareHolder")
const itemIncomeTotal = require("../models/itemIncomeTotal")
const moment = require("moment-timezone")
const { calculateItemWithShareholder } = require("../helper/calculateItemWithShareholderIdHelper")

exports.calcuateItemPriceAccordingToShareholderService = async (data) => {
    let { relatedItem, relatedShareHolder, startDate, endDate } = data
    let result = []
    let total = {}
    let query = { isDeleted: false }
    !relatedItem  && !relatedShareHolder ? query.date = { $gte: moment.tz("Asia/Yangon").startOf("day").format() , $lt: moment.tz("Asia/Yangon").startOf("day").format() } : ""
    startDate && endDate ? query.date = { $gte: moment.tz(startDate, "Asia/Yangon").startOf("day").format(), $lte: moment.tz(endDate, "Asia/Yangon").startOf("day").format() } : ""    // filter items in itemIncome
    console.log("query",query)
    if(relatedItem){
        let itemIncome = {}
        query.relatedItem = relatedItem
        const itemIncomeResult = await itemIncomeTotal.find(query).populate("relatedItem")
        const shareHolderByItemId = await itemAndShareHolder.find({relatedItem: relatedItem}).populate("relatedShareHolder.shareholder_id")
        if(itemIncomeResult.length > 0){
            itemIncomeResult.forEach(income => {
                const purchasePrice = income.purchasePrice || 0
                const quantity = income.quantity || 0
                const amount = income.amount || 0
                itemIncome["name"] = income.relatedItem.name
                itemIncome["purchasePrice"] = Number( itemIncome["purchasePrice"] || 0 ) + purchasePrice
                itemIncome["quantity"] = Number( itemIncome["quantity"] || 0 ) + quantity
                itemIncome["amount"] = Number( itemIncome["amount"] || 0 ) + amount
            })
        }
        if(shareHolderByItemId.length > 0){
            shareHolderByItemId.forEach(shareHolder => {
               const shareHolderResult = shareHolder
               let revenueProfit = ( Number(itemIncome.amount) - Number(itemIncome.purchasePrice) )
               let shareHolderProfit = Number(revenueProfit * shareHolderResult.percent) / 100
               result.push({name: itemIncome.name, totalSellingAmount: itemIncome.amount, totalPurchaseAmount: itemIncome.purchasePrice, revenueProfit: revenueProfit, shareHolderPercent: shareHolderResult.percent, shareHolder: shareHolderResult.relatedShareHolder.name, shareHolderProfit: shareHolderProfit})
            })
        }
    }
    if(relatedShareHolder){
        query.relatedShareHolder = relatedShareHolder
        // const itemIncomeResult = await itemIncomeTotal.find(query).populate("relatedItem")
        const shareHolderById = await itemAndShareHolder.find({relatedShareHolder: relatedShareHolder}).populate("relatedShareHolder")
        if(shareHolderById.length > 0){
            const calculateFunction = await calculateItemWithShareholder(query, shareHolderById)
            result = calculateFunction.result, total = calculateFunction.total
        }
    }
    //if there is no relatedItem and relatedShareHolder Id, then query with today date
    if(!relatedItem && !relatedShareHolder){
        const shareHolderById = await itemAndShareHolder.find().populate("relatedShareHolder")
        if(shareHolderById.length > 0){
            const calculateFunction = await calculateItemWithShareholder(query, shareHolderById)
            result = calculateFunction.result, total = calculateFunction.total
        }
    }
    return { data: result, total: total }
}