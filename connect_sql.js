const sql = require("mssql");

// -------------cẤU HÌNH SQL-----------

const config = {
  user: "sa",
  password: "123", //Tự làm mật khẩu server của cá nhân
  server: "DESKTOP-EFGDU03\\SQLTEST_CONNECT", //Tên Server cá nhân
  database: "BTLWEB", // Tên CSDL đã đặt trong SQL
  driver: "msnodesqlv8",
  options: {
    trustServerCertificate: true, // fix lỗi self-signed certificate
    encrypt: true,
  },
};

module.exports = config;
