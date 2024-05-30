const sql = require("mssql");
const config = require("../connect_sql");
const UserModel = require("../models/user.model");

const displayAccount = async (req, res) => {
  const user = res.locals.user;
  const userData = await UserModel.getById(user.ID);
  res.render("user/pages/account", {
    id: userData.ID,
    name: userData.Username,
    email: userData.Email,
    date: userData.CreationDate,
    role: userData.Role,
  });
};

// ------------HÀM CẬP NHẬT THÔNG TIN ĐÃ SỬA ĐỔI TỪ NGƯỜI DÙNG-----------

const updateAccount = async (req, res) => {
  const user = res.locals.user;
  await UserModel.updateUser(user.ID, req.body.username);
  res.redirect("/account");
};

function createAccount(username, email, password) {
  UserModel.createUser(username, email, password);
}

module.exports = {
  displayAccount,
  updateAccount,
  createAccount,
};
