const path = require("path");
const fs = require("fs");

const express = require("express");
const router = express.Router();
const multer = require("multer");

const adminController = require("../controller/adminController");
const categoryController = require("../controller/categoryController");
const storyController = require("../controller/storyController");
const chapterController = require("../controller/chapterController");

const UserModel = require("../models/user.model");

router.get("/", checkAdmin, categoryController.categoryStoryDisplayAdmin);

router.get("/:id/:title", storyController.displayStoryAdmin);

router.use(express.urlencoded({ extended: true }));

//STORE ảnh với Chapter

function generateRandomId() {
  // Độ dài của ID mong muốn
  const length = 8;
  // Các ký tự có thể sử dụng trong ID
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomId = "";

  for (let i = 0; i < length; i++) {
    // Chọn một ký tự ngẫu nhiên từ chuỗi characters
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters[randomIndex];
  }

  return randomId;
}

const storageChapter = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = `public/assest/Cover Images/${req.body.idStory}/${req.body.nameChapter}/`;

    fs.mkdirSync(folderPath, { recursive: true });
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const formatted = `image_${Date.now()}_${generateRandomId()}`;

    cb(null, formatted + path.extname(file.originalname));
  },
});

const uploadImginChapter = multer({ storage: storageChapter });

router.post(
  "/:idStory/:titleStory/:nameChapter/updateChapter",
  uploadImginChapter.array("uploadImage", 10),
  chapterController.updateChapter
);

router.post("/:id/:title/addNewChapter", chapterController.addNewChapter);

router.get(
  "/:idStory/:titleStory/:nameChapter",
  chapterController.displayUpdateChapter
);

//STORE ảnh với Story
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assest/Cover Images/");
  },
  filename: function (req, file, cb) {
    const currentDate = new Date();

    // Format ngày giờ thành chuỗi yyyymmddhhmmss
    const year = currentDate.getFullYear();
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const day = ("0" + currentDate.getDate()).slice(-2);
    const hour = ("0" + currentDate.getHours()).slice(-2);
    const minute = ("0" + currentDate.getMinutes()).slice(-2);
    const second = ("0" + currentDate.getSeconds()).slice(-2);

    const formattedDate = `${year}-${month}-${day} ${hour}-${minute}-${second}`;

    cb(null, formattedDate + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post(
  "/updateInforStory",
  upload.single("uploadImage"),
  storyController.updateInforStory
);

router.post(
  "/addNewStory",
  upload.single("uploadImage"),
  storyController.addNewStory
);

router.get("/searchStoryByName", adminController.searchStoryByName);

router.get("/addStory", adminController.displayAddStory);

async function checkAdmin(req, res, next) {
  const user = res.locals.user;

  const userData = await UserModel.getById(user.ID);
  if (req.isAuthenticated() && userData.isAdmin == true) {
    // Nếu đã xác thực và là admin, cho phép tiếp tục
    return next();
  }
  // Nếu không phải admin, chuyển hướng đến trang chính
  res.redirect("/");
}

module.exports = router;
