const { calcuateItemPriceAccordingToShareholderService } = require("../services/calculateItemPriceAccrdingToShareholderService");
const { calculateTotalIncome, totalTopTenList } = require("../services/calculateTotalIncome");
const { getAllDamageItems, createDamageItems, updateDamageItem, getDamageItemById, deleteDamageItem } = require("../services/damagePersonalService");
const { listAllIncome, createIncome, updateIncome, getIncomeById, deleteIncome } = require("../services/incomeService");
const { getItemAndShareHolders, createItemAndShareHolder, updateItemAndShareHolder, getItemAndShareHolderById, deleteItemAndShareHolder } = require("../services/itemAndShareHolderService");
const { getItemIncome, createItemIncome, updateitemIncomeTotal, getitemIncomeTotalById, deleteitemIncomeTotal } = require("../services/itemIncomeService");
const { getAllItemPackage, createitemsPackage, updateItemPackage, getItemPackageById, deleteItemPackage } = require("../services/itemPackageService");
const { deleteItem, getItemById, updateItem, createItems, getAllItems } = require("../services/itemService");
const { getAllItemTitles, createItemTitle, updateTitleItem, getItemTitleById, deleteTitleItem } = require("../services/itemTitleService");
const { deleteItemVoucher, getItemVoucherById, updateItemVoucher, createItemVoucher, getAllItemVoucher } = require("../services/itemVoucherServices");
const { getShareHolders, createShareHolder, updateShareHolder, getShareHolderById, deleteShareHolder } = require("../services/shareHolderService");
const { getAllSuperCategories, createSuperCategories, updateCategories, getCategoriesById, deleteSuperCategories } = require("../services/superCategoryService");
const { getAllStockIncludingRepackage, getSaleItemsAndPackage } = require("../services/totalItemStockService");
const { voucherTotalCalculationService } = require("../services/voucherTotalCalculationService");

exports.ServiceDatas = {
    "super-category": {
        list: getAllSuperCategories, 
        create: createSuperCategories, 
        update: updateCategories, 
        listById: getCategoriesById,
        delete: deleteSuperCategories,  //add delete functionality here
    },
    "item":{
        list: getAllItems, 
        create: createItems, 
        update: updateItem, 
        listById: getItemById,
        delete: deleteItem
    },
    "item-package": {
        list: getAllItemPackage,
        create: createitemsPackage,
        update: updateItemPackage,
        listById: getItemPackageById,
        delete: deleteItemPackage
    },
    "item-title": {
        list: getAllItemTitles,
        create: createItemTitle,
        update: updateTitleItem,
        listById: getItemTitleById,
        delete: deleteTitleItem
    },
    "stock-and-package": {
        list: getAllStockIncludingRepackage
    },
    "damage-item":{
        list: getAllDamageItems,
        create: createDamageItems,
        update: updateDamageItem,
        listById: getDamageItemById,
        delete: deleteDamageItem
    },
    "personal-use-item":{
        list: getAllDamageItems,
        create: createDamageItems,
        update: updateDamageItem,
        listById: getDamageItemById,
        delete: deleteDamageItem
    },
    "item-voucher":{
        list: getAllItemVoucher,
        create: createItemVoucher,
        update: updateItemVoucher,
        listById: getItemVoucherById,
        delete: deleteItemVoucher
    },
    "income":{
        list: listAllIncome,
        create: createIncome,
        update: updateIncome,
        listById: getIncomeById,
        delete: deleteIncome
    },
    "sale-stock-and-package": {
        list: getSaleItemsAndPackage
    },
    "voucher-calculation": {
        list: voucherTotalCalculationService
    },
    "total-account-reports": {
        list: calculateTotalIncome
    },
    "top-ten": {
        list: totalTopTenList
    },
    "share-holder": {
        list: getShareHolders,
        create: createShareHolder,
        update: updateShareHolder,
        listById: getShareHolderById,
        delete: deleteShareHolder
    },
    "item-and-shareholder": {
        list: getItemAndShareHolders,
        create: createItemAndShareHolder,
        update: updateItemAndShareHolder,
        listById: getItemAndShareHolderById,
        delete: deleteItemAndShareHolder
    },
    "item-income": {
        list: getItemIncome,
        create: createItemIncome,
        update: updateitemIncomeTotal,
        listById: getitemIncomeTotalById,
        delete: deleteitemIncomeTotal
    },
    "calculate-shareholder-item": {
        list: calcuateItemPriceAccordingToShareholderService
    }
}