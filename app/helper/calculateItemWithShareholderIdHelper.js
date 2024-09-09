"use strict"

const itemIncomeTotal = require("../models/itemIncomeTotal")

exports.calculateItemWithShareholder = async (query, shareHolderIdArray) => {
    let result = []
    let total = {}
    for(const shareHolder of shareHolderIdArray){
        let shareHolderAndItemData = { percent: shareHolder.percent, shareHolderName: shareHolder.relatedShareHolder ? shareHolder.relatedShareHolder.name : "Deleted User" }
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
        let revenueProfit = ( Number(itemIncome.amount) - Number(itemIncome.purchasePrice) ) || 0
        let shareHolderProfit = Number(revenueProfit * shareHolderAndItemData.percent) / 100 || 0
        let profitwithoutGross  = (Number(itemIncome.amount) * Number(shareHolderAndItemData.percent) )/ 100 || 0
        result.push({name: itemIncome.name, totalSellingAmount: itemIncome.amount, totalPurchaseAmount: itemIncome.purchasePrice, revenueProfit: revenueProfit, shareHolderPercent: shareHolderAndItemData.percent, shareHolder: shareHolderAndItemData.shareHolderName, shareHolderProfit: shareHolderProfit, profitWithoutGross: profitwithoutGross})
    }
    result.map(re=>{
        total["totalSellingAmount"] = ( Number(total["totalSellingAmount"] ) || 0) + ( re.totalSellingAmount || 0 )
        total["totalPurchaseAmount"] = ( Number(total["totalPurchaseAmount"]) || 0) + ( re.totalPurchaseAmount || 0 )
        total["revenueProfit"] = ( Number(total["revenueProfit"]) || 0) + ( re.revenueProfit || 0 )
        total["shareHolderProfit"] = ( Number(total["shareHolderProfit"] ) || 0) + ( re.shareHolderProfit || 0 )
        total["profitWithoutGross"] = ( Number(total["profitWithoutGross"] ) || 0) + ( re.profitWithoutGross || 0 )
    })
    return { result: result, total: total }
}