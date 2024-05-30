const fs = require("fs");

const StoryModel = require("../models/story.model");
const UserModel = require("../models/user.model");
const GenreModel = require("../models/genre.model");
const ChapterModel = require("../models/chapter.model");
const CommentModel = require("../models/comment.model");

const displayStoryAdmin = async (req, res) => {
  const id = req.params.id;
  const storyData = await StoryModel.getById(id);

  const user = res.locals.user;
  const userData = await UserModel.getById(user.ID);
  const listGenre = await StoryModel.getGenreName(id);
  const listChapter = await ChapterModel.getAllChapterByStoryId(id);

  const allGenre = await GenreModel.getAll();

  res.render("admin/pages/detailsStory", {
    name: userData.Username,
    storyData: storyData,
    listGenre: listGenre,
    allGenre: allGenre,
    listChapter: listChapter,
  });
};

const displayStoryUser = async (req, res) => {
  const id = req.params.id;
  const storyData = await StoryModel.getById(id);

  const user = res.locals.user;
  const userData = await UserModel.getById(user.ID);
  const listGenre = await StoryModel.getGenreName(id);
  const listChapter = await ChapterModel.getAllChapterByStoryId(id);

  const allGenre = await GenreModel.getAll();

  const isFavorite = (
    await StoryModel.checkStoryFavoriteByidUser(storyData.ID, user.ID)
  ).length;

  const allComment = await CommentModel.getAllCommentByStoryId(storyData.ID);
  res.render("user/pages/detailsStory", {
    name: userData.Username,
    storyData: storyData,
    listGenre: listGenre,
    allGenre: allGenre,
    listChapter: listChapter,
    isFavorite: isFavorite,
    allComment: allComment,
  });
};

const updateInforStory = async (req, res) => {
  const idStory = parseInt(req.body.idStory);
  const title = req.body.title;
  const author = req.body.author;
  const description = req.body.description;
  const filename = await StoryModel.getTitleById(idStory);

  const listGenreString = req.body.listGenreString;

  const genres = listGenreString.split(".");
  const values = genres.map((genreId) => `(${idStory}, ${genreId})`).join(",");

  if (req.file) {
    const imagePath = req.file.path;
    const path = imagePath.split("\\");
    const newImagePath = `${path[0]}\\${path[1]}\\${path[2]}\\${filename.Title} ${path[3]}`;
    fs.renameSync(imagePath, newImagePath);
    const newPath = `/${path[1]}/${path[2]}/${filename.Title} ${path[3]}`;
    await StoryModel.updateStory(
      idStory,
      title,
      author,
      description,
      newPath,
      values
    );
  } else {
    await StoryModel.updateStoryWithoutImage(
      idStory,
      title,
      author,
      description,
      values
    );
  }
  res.redirect(`/adminDashboard/${idStory}/${title}`);
};

const addNewStory = async (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const description = req.body.description;

  const imagePath = req.file.path;
  const path = imagePath.split("\\");
  const newImagePath = `${path[0]}\\${path[1]}\\${path[2]}\\${title} ${path[3]}`;
  fs.renameSync(imagePath, newImagePath);
  const newPath = `/${path[1]}/${path[2]}/${title} ${path[3]}`;
  await StoryModel.addNewStory(title, author, description, newPath);
  res.redirect(`/adminDashboard`);
};

const addNewFavoriteStory = async (req, res) => {
  const idStory = req.body.idStory;
  const nameStory = req.body.nameStory;

  const user = res.locals.user;
  const userId = user.ID;

  await StoryModel.addNewFavoriteStory(idStory, userId);
  res.redirect(`/category/${idStory}/${nameStory}`);
};

const deleteFavoriteStory = async (req, res) => {
  const idStory = req.body.idStory;
  const nameStory = req.body.nameStory;

  const user = res.locals.user;
  const userId = user.ID;

  await StoryModel.deleteFavoriteStory(idStory, userId);
  res.redirect(`/category/${idStory}/${nameStory}`);
};

const displayFavoriteStories = async (req, res) => {
  const user = res.locals.user;
  const userData = await UserModel.getById(user.ID);
  const stories = await StoryModel.getAllFavoriteStoryByIduser(user.ID);
  res.render("user/pages/favorite", {
    name: userData.Username,
    stories: stories,
  });
};

module.exports = {
  displayStoryAdmin,
  displayStoryUser,
  updateInforStory,
  addNewStory,
  addNewFavoriteStory,
  deleteFavoriteStory,
  displayFavoriteStories,
};
