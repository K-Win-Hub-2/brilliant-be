"use strict"
const itemAndShareHolder = require("../models/itemAndShareHolder")
const itemIncomeTotal = require("../models/itemIncomeTotal")
const moment = require("moment-timezone")

exports.calcuateItemPriceAccordingToShareholderService = async (data) => {
    let { relatedItem, relatedShareHolder, startDate, endDate } = data
    let result = []
    let total = {}
    let query = { isDeleted: false }
    startDate && endDate ? query.date = { $gte: moment.tz(startDate, "Asia/Yangon").startOf("day").format(), $lte: moment.tz(endDate, "Asia/Yangon").startOf("day").format() } : ""    // filter items in itemIncome
    console.log("query",query)
    if(relatedItem){
        let itemIncome = {}
        query.relatedItem = relatedItem
        const itemIncomeResult = await itemIncomeTotal.find(query).populate("relatedItem")
        const shareHolderByItemId = await itemAndShareHolder.find({relatedItem: relatedItem}).populate("relatedShareHolder")
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
            for(const shareHolder of shareHolderById){
                let shareHolderAndItemData = { percent: shareHolder.percent, shareHolderName: shareHolder.relatedShareHolder.name }
                const Item = shareHolder.relatedItem.toString()
                query.relatedItem = Item
                const itemIncomeResult = await itemIncomeTotal.find(query).populate("relatedItem")
                const itemIncome = {}
                itemIncomeResult.forEach(item=>{
                    const purchasePrice = item.purchasePrice || 0
                    const quantity = item.quantity || 0
                    const amount = item.amount || 0
                    itemIncome["name"] = item.relatedItem.name
                    itemIncome["purchasePrice"] = Number( itemIncome["purchasePrice"] || 0 ) + purchasePrice
                    itemIncome["quantity"] = Number( itemIncome["quantity"] || 0 ) + quantity
                    itemIncome["amount"] = Number( itemIncome["amount"] || 0 ) + amount
                })
                console.log("d",itemIncome,shareHolderAndItemData)
                let revenueProfit = ( Number(itemIncome.amount) - Number(itemIncome.purchasePrice) )
                let shareHolderProfit = Number(revenueProfit * shareHolderAndItemData.percent) / 100
                let profitwithoutGross  = (Number(itemIncome.amount) * Number(shareHolderAndItemData.percent) )/ 100
                result.push({name: itemIncome.name, totalSellingAmount: itemIncome.amount, totalPurchaseAmount: itemIncome.purchasePrice, revenueProfit: revenueProfit, shareHolderPercent: shareHolderAndItemData.percent, shareHolder: shareHolderAndItemData.shareHolderName, shareHolderProfit: shareHolderProfit, profitWithoutGross: profitwithoutGross})
            }
        }
        result.map(re=>{
            total["totalSellingAmount"] = ( Number(total["totalSellingAmount"] ) || 0) + re.totalSellingAmount
            total["totalPurchaseAmount"] = ( Number(total["totalPurchaseAmount"]) || 0) + re.totalPurchaseAmount
            total["revenueProfit"] = ( Number(total["revenueProfit"]) || 0) + re.revenueProfit
            total["shareHolderProfit"] = ( Number(total["shareHolderProfit"] ) || 0) + re.shareHolderProfit
            total["profitWithoutGross"] = ( Number(total["profitWithoutGross"] ) || 0) + re.profitWithoutGross
        })
    }
    return { data: result, total: total }
}