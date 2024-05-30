const sql = require("mssql");
const config = require("../connect_sql");

const StoryModel = require("../models/story.model");
const GenreModel = require("../models/genre.model");
const UserModel = require("../models/user.model");

//----------------------ADMIN CONTROLLER----------------------

const categoryStoryDisplayAdmin = async (req, res) => {
  const user = res.locals.user;

  const userData = await UserModel.getById(user.ID);
  const category = await GenreModel.getAll();
  const stories = await StoryModel.getAll();

  res.render("admin/pages/adminDashboard", {
    category: category,
    stories: stories,
    name: userData.Username,
  });
};

//----------------------USER CONTROLLER----------------------

//function hiển thị tất cả các truyện và thể loại
const categoryStoryDisplay = async (req, res) => {
  const user = res.locals.user;

  const userData = await UserModel.getById(user.ID);
  const category = await GenreModel.getAll();
  const stories = await StoryModel.getAll();

  const list_OfList_GenreOfEachStory = [];
  for (let i = 0; i < stories.length; i++) {
    const listGEnreOfEachStory = await StoryModel.getGenreName(stories[i].ID);
    list_OfList_GenreOfEachStory.push(listGEnreOfEachStory);
  }
  res.render("user/pages/categories", {
    category: category,
    stories: stories,
    list_OfList_GenreOfEachStory: list_OfList_GenreOfEachStory,
    name: userData.Username,
  });
};

//function lọc các truyện theo thể loại
const filterByGenre = async (req, res) => {
  const genre = req.params.genre; // lấy thể loại để lọc
  const user = res.locals.user;

  const userData = await UserModel.getById(user.ID);
  const category = await GenreModel.getAll();
  const stories = await GenreModel.getStory(genre);

  const list_OfList_GenreOfEachStory = [];
  for (let i = 0; i < stories.length; i++) {
    const listGEnreOfEachStory = await StoryModel.getGenreName(stories[i].ID);
    list_OfList_GenreOfEachStory.push(listGEnreOfEachStory);
  }

  res.render("user/pages/categories", {
    category: category,
    stories: stories,
    list_OfList_GenreOfEachStory: list_OfList_GenreOfEachStory,
    name: userData.Username,
  });
};

//function tìm kiếm truyện theo tên được nhập
const searchStoryByName = async (req, res) => {
  const user = res.locals.user;
  const keyword = req.query.keywordSearch;

  const userData = await UserModel.getById(user.ID);
  const stories = await StoryModel.getByKeyword(keyword);

  var notification = "";
  if (stories.length === 0) {
    notification = "Không tìm thấy truyện phù hợp!";
  } else {
    notification = `Đã tìm thấy ${stories.length} truyện!`;
  }

  const list_OfList_GenreOfEachStory = [];
  for (let i = 0; i < stories.length; i++) {
    const listGEnreOfEachStory = await StoryModel.getGenreName(stories[i].ID);
    list_OfList_GenreOfEachStory.push(listGEnreOfEachStory);
  }

  res.render("user/pages/searchResult.ejs", {
    name: userData.Username,
    notification: notification,
    stories: stories,
    list_OfList_GenreOfEachStory: list_OfList_GenreOfEachStory,
  });
};

module.exports = {
  categoryStoryDisplay,
  categoryStoryDisplayAdmin,
  filterByGenre,
  searchStoryByName,
};
