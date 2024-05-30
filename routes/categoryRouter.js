const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const StoryModel = require("../models/story.model");
const categoryController = require("../controller/categoryController");
const storyController = require("../controller/storyController");
const chapterController = require("../controller/chapterController");
const commentController = require("../controller/commentController");

router.use(bodyParser.json());

router.get("/:genre", categoryController.filterByGenre);

router.get("/", categoryController.categoryStoryDisplay);

router.get("/:id/:title", storyController.displayStoryUser);

router.get("/:id/:title/:chapter", chapterController.displayChapterUser);

router.post("/addNewFavoriteStory", storyController.addNewFavoriteStory);

router.post("/deleteFavoriteStory", storyController.deleteFavoriteStory);

router.post("/comment", commentController.addNewComment);

module.exports = router;
