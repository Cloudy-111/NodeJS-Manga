const sql = require("mssql");
const config = require("../connect_sql");

const User = {
  getById: async (userId) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("userId", sql.Int, userId)
        .query("SELECT * FROM [dbo].[Userr] WHERE [ID] = @userId");
      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      console.error("Error: ", error);
    }
  },
  getByEmail: async (email) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("email", sql.VarChar, email)
        .query("SELECT * FROM [dbo].[Userr] WHERE [Email] = @email");
      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      console.error("Error: ", error);
    }
  },
  getAllUSer: async () => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .query("SELECT * FROM [dbo].[Userr] WHERE [isAdmin] = 0");
      return result.recordset;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
  createUser: async (username, email, password) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("username", sql.VarChar, username)
        .input("email", sql.VarChar, email)
        .input("password", sql.VarChar, password)
        .query(
          "INSERT INTO [dbo].[Userr] ([Username], [Email], [Password], [CreationDate]) VALUES (@username, @email, @password, CONVERT(DATE, GETDATE()))"
        );
      console.log("Insert Data Successfully!");
      return result.rowsAffected > 0;
    } catch (error) {
      console.error("Error: ", error);
    }
  },
  updateUser: async (userId, username) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("userId", sql.Int, userId)
        .input("username", sql.VarChar, username)
        .query(
          "UPDATE [dbo].[Userr] SET [Username] = @username WHERE [ID] = @userId"
        );

      console.log("Update Data Successfully");
      return result.rowsAffected > 0;
    } catch (error) {
      console.log("Error: ", error);
    }
  },
};

module.exports = User;
