const path = require("path");
const fs = require("fs");

const express = require("express");
const router = express.Router();
const multer = require("multer");

const adminController = require("../controller/adminController");
const categoryController = require("../controller/categoryController");
const storyController = require("../controller/storyController");
const chapterController = require("../controller/chapterController");

//STORE ảnh với Chapter
let uploadImginChapterIndex = 1;

const storageChapter = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = `public/assest/Cover Images/${req.body.idStory}/`;
    fs.mkdirSync(folderPath, { recursive: true });

    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const index = uploadImginChapterIndex++;
    const formatted = `image_${index}`;

    cb(null, formatted + path.extname(file.originalname));
  },
});

const uploadImginChapter = multer({ storage: storageChapter });

router.post("/addNewChapter", chapterController.addNewChapter);

module.exports = router;
