if (process.env.NODE_SECRET !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
var path = require("path");
const bcrypt = require("bcrypt"); // Import bcrypt package - là thư viện để mã hóa mật khẩu
const passport = require("passport");
const initializePassport = require("./passport-config");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const config = require("./connect_sql");

const settingRouter = require("./routes/settingRouter");
const categoryRouter = require("./routes/categoryRouter");
const accountRouter = require("./routes/accountRouter");
const searchResultRouter = require("./routes/searchResultRouter");
const userRouter = require("./routes/userRouter");
const favoriteRouter = require("./routes/favoriteRouter");

const adminRouter = require("./routes/adminRouter");

const accountController = require("./controller/accountController");
const storyController = require("./controller/storyController");

const UserModel = require("./models/user.model");

const sql = require("mssql");

// ------------KHỞI TẠO PASSPORT TỪ FILE PASSPORT-CONFIG-----------

initializePassport(passport, UserModel.getByEmail, UserModel.getById);

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// ------------XÁC THỰC THÔNG TIN ĐĂNG NHẬP-----------

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("user", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.post(
  "/loginAdmin",
  checkNotAuthenticated,
  passport.authenticate("admin", {
    successRedirect: "/adminDashboard",
    failureRedirect: "/loginAdmin",
    failureFlash: true,
  })
);

// ------------NHẬN CÁC THÔNG TIN ĐĂNG KÍ-----------

app.post("/register", checkNotAuthenticated, async (req, res) => {
  if (req.body.username && req.body.email && req.body.password) {
    // lấy dữ liệu từ trang register
    try {
      await sql.connect(config);
      //Kiểm tra Email trùng
      const checkEmailQUery = `SELECT COUNT(*) AS count FROM [dbo].[Userr] WHERE [Email] = '${req.body.email}'`;
      const { recordset } = await sql.query(checkEmailQUery);
      const isEmailDuplicate = recordset[0].count > 0;
      if (isEmailDuplicate) {
        const messageError = { error: "Email bị trùng với email đã có!" };
        res.render("register.ejs", { messages: messageError });
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); //mã hóa mật khẩu
        accountController.createAccount(
          req.body.username,
          req.body.email,
          hashedPassword
        );

        res.redirect("/login"); //kết quả trả về là trang login
      }
    } catch (error) {
      console.log(error);
      res.redirect("/register");
    }
  } else {
    const message = { error: "Chưa đầy đủ thông tin. Kiểm tra lại!" };
    res.render("register.ejs", { messages: message });
  }
});

app.set("view engine", "ejs"); // cho gọn, không cần viết file.ejs

app.use(async (req, res, next) => {
  // req.user đang trả về một promise chưa được giải quyết.
  // Nguyên nhân là vì quá trình xác thực hoặc lấy thông tin người dùng đang được thực hiện bất đồng bộ và trả về một promise.
  // Giải quyết: sử dụng async/await
  res.locals.user = await req.user;
  next();
});

//-------------login Route-------------
app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.get("/loginAdmin", checkNotAuthenticated, (req, res) => {
  res.render("admin_login.ejs");
});

//-------------signup Route-------------
app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

//-------------dashboard admin-------------
app.use("/adminDashboard", adminRouter);

// app.get("/listUser", async (req, res) => {
//   res.render("admin/pages/listUser");
// });

// app.use("/listUser", adminRouter);

//-------------home Route-------------
app.use("/", userRouter);

//-------------search Result Route-------------
app.use("/searchResult", searchResultRouter);

//-------------setting Route-------------
app.use("/setting", settingRouter);

//-------------account Route-------------
app.use("/account", accountRouter);

//-------------category Route-------------
app.use("/category", categoryRouter);

//-------------favorite Route-------------
app.use("/favorite", favoriteRouter);

// End routes

app.delete("/logout", (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/register");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.use(express.static(path.join(__dirname, "public")));
app.listen(3000);
