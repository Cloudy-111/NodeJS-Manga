const express = require("express");
const router = express.Router();

const categoryController = require("../controller/categoryController");
const storyController = require("../controller/storyController");
const chapterController = require("../controller/chapterController");

router.get("/", storyController.displayFavoriteStories);

module.exports = router;
