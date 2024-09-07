"use strict";

const shareRevenue = require("../controllers/shareHolderRevenueController");
const { catchError } = require("../lib/errorHandler");
const verifyToken = require("../lib/verifyToken");

module.exports = (app) => {
  app
    .route("/api/share-revenue")
    .post(catchError(shareRevenue.createShareRevenue))
    .put(catchError(shareRevenue.updateShareRevenue))
    .get(catchError(shareRevenue.listAllShareRevenue));

  app
    .route("/api/share-revenue/:id")
    .get(catchError(shareRevenue.getShareRevenue))
    .delete(catchError(shareRevenue.deleteShareRevenue));
};
