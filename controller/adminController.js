const sql = require("mssql");
const config = require("../connect_sql");
const UserModel = require("../models/user.model");
const StoryModel = require("../models/story.model");
const GenreModel = require("../models/genre.model");

const getListAllUser = async (req, res) => {
  const listUser = await UserModel.getAllUSer();
  res.render("admin/pages/listUser", {
    listUser: listUser,
  });
};

const searchStoryByName = async (req, res) => {
  const user = res.locals.user;
  const keyword = req.query.keywordSearch;

  const userData = await UserModel.getById(user.ID);
  const stories = await StoryModel.getByKeyword(keyword);
  const category = await GenreModel.getAll();

  var notification = "";
  if (stories.length === 0) {
    notification = "Không tìm thấy truyện phù hợp!";
  } else {
    notification = `Đã tìm thấy ${stories.length} truyện!`;
  }

  res.render("admin/pages/adminDashboard", {
    name: userData.Username,
    stories: stories,
    category: category,
  });
};

const displayAddStory = async (req, res) => {
  const allGenre = await GenreModel.getAll();
  const user = res.locals.user;
  const userData = await UserModel.getById(user.ID);
  res.render("admin/pages/addStory", {
    name: userData.Username,
    allGenre: allGenre,
  });
};

module.exports = {
  getListAllUser,
  searchStoryByName,
  displayAddStory,
};
