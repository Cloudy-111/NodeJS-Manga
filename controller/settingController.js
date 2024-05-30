const setting_first = async (req, res) => {
  res.render("pages/setting", { name: res.locals.user.Username });
};

module.exports = {
  setting_first,
};
