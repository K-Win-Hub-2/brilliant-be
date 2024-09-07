"use strict"

const { paginationHelper } = require("../helper/paginationHelper")
const shareHolder = require("../models/shareHolder")

exports.getShareHolders = async (datas) => {
    try{
       let { email, phone, limit, offset, sort } = datas
       let query = { isDeleted: false }
       let sortByAscending = {id: 1}
       email ? query.email = email : ""
       phone ? query.phone = phone : ""
       if (sort) sortByAscending = { id: -1 }
       let count = await shareHolder.find(query).count()
       let paginationHelpers = await paginationHelper(count, offset, limit) 
       let result = await shareHolder.find(query).limit(paginationHelpers.limit).skip(paginationHelpers.skip).sort(sortByAscending).exec()
        return { data: result, meta_data: paginationHelpers}; 
    }catch(err){
        console.log("Error is", err.message)
    }
    
}

exports.createShareHolder = async (datas) => {
    try{
       let result = await shareHolder.create(datas)
       return result; 
    }
    catch(err){
        console.log("Error is", err.message)
    }
}

exports.getShareHolderById = async (id) => {
    try{
       let result = await shareHolder.findById(id)
        return result; 
    }catch(err){
        console.log("Error is", err.message)
    }
    
}

exports.updateShareHolder = async (id, datas) => {
    try{
       let result = await shareHolder.findByIdAndUpdate(id, datas, { new: true })
       return result; 
    }catch(err){
        console.log("Error is", err.message)
    }
}

exports.deleteShareHolder = async (id) => {
    try{
       let result = await shareHolder.findByIdAndUpdate(id, {isDeleted: true}, { new: true })
       return result; 
    }catch(err){
        console.log("Error is", err.message)
    }
}

