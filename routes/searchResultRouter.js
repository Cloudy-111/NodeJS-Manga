const express = require("express");
const router = express.Router();
const sql = require("mssql");

const categoryController = require("../controller/categoryController");

//Tìm kiếm truyện theo từ khóa
router.get("/", categoryController.searchStoryByName);

module.exports = router;
