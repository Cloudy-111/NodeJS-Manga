const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();
const storyController = require("../controller/storyController");
const commentController = require("../controller/commentController");

const StoryModel = require("../models/story.model");
const GenreModel = require("../models/genre.model");
const UserModel = require("../models/user.model");
const ChapterModel = require("../models/chapter.model");
const CommentModel = require("../models/comment.model");

router.use(bodyParser.json());

router.get("/", checkAuthenticated, async (req, res) => {
  const user = res.locals.user;

  const userData = await UserModel.getById(user.ID);
  const category = await GenreModel.getAll();
  const stories = await StoryModel.getAll();
  res.render("user/pages/index", {
    category: category,
    stories: stories,
    name: userData.Username,
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/register");
}

router.post(
  "/:id/:title/:idChapter/comment",
  commentController.addNewCommentinChapter
);

//----------------------API----------------------
router.get("/api/allBook", async (req, res) => {
  const stories = await StoryModel.getAll();
  res.send(stories);
});

router.get("/api/allGenre", async (req, res) => {
  const category = await GenreModel.getAll();
  res.send(category);
});

router.get("/api/favoriteStory", async (req, res) => {
  const user = res.locals.user;
  const stories = await StoryModel.getAllFavoriteStoryByIduser(user.ID);
  res.send(stories);
});

router.get("/api/:id/:title", async (req, res) => {
  const id = parseInt(req.params.id);
  const storyData = await StoryModel.getById(id);
  res.send(storyData);
});

router.get("/api/:id/:title/:chapter", async (req, res) => {
  const idStory = req.params.id;
  const nameChapter = req.params.chapter;
  const idChapter = parseInt(
    (await ChapterModel.getIdChapterByNameANDStoryID(nameChapter, idStory)).ID
  );
  const listImageInChapter = await ChapterModel.getListImageinChapter(
    idChapter
  );
  res.send(listImageInChapter);
});

router.get("/apicomment/:id/:title", async (req, res) => {
  const id = parseInt(req.params.id);
  const storyData = await StoryModel.getById(id);
  const allComment = await CommentModel.getAllCommentByStoryId(storyData.ID);
  res.send(allComment);
});

router.get("/api/allUser", async (req, res) => {
  const allUser = await UserModel.getAllUSer();
  res.send(allUser);
});

module.exports = router;
