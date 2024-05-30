const express = require("express");
const router = express.Router();

const settingController = require("../controller/settingController");

router.get("/", settingController.setting_first);

module.exports = router;
