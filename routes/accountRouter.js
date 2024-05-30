const express = require("express");
const router = express.Router();

const accountController = require("../controller/accountController");

// ------------THAY ĐỔI THÔNG TIN USER-----------

router.post("/", accountController.updateAccount);

router.get("/", accountController.displayAccount);

module.exports = router;
