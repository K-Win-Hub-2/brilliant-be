"use strict";

const withdraw = require("../controllers/withdrawController");
const { catchError } = require("../lib/errorHandler");
const verifyToken = require("../lib/verifyToken");

module.exports = (app) => {
  app
    .route("/api/withdraw")
    .post(catchError(withdraw.createWithdraw))
    .put(catchError(withdraw.updateWithdraw))
    .get(catchError(withdraw.listAllWithdraw));
  app.route("/api/withdraw/history").get(catchError(withdraw.withdrawHistory));
  app
    .route("/api/withdraw/history/filter")
    .get(catchError(withdraw.withdrawHistoryFilter));
  app
    .route("/api/withdraw/:id")
    .get(catchError(withdraw.getWithdraw))
    .delete(catchError(withdraw.deleteWithdraw));
};
