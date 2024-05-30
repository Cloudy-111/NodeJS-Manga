const sql = require("mssql");
const config = require("../connect_sql");

const Story = {
  getById: async (storyId) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("storyId", sql.Int, storyId)
        .query("SELECT * FROM [dbo].[Story] WHERE [ID] = @storyId");
      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  },
  getTitleById: async (storyId) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("storyId", sql.Int, storyId)
        .query("SELECT [Title] FROM [dbo].[Story] WHERE [ID] = @storyId");
      return result.recordset[0];
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  },
  getByTitle: async (title) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("title", sql.VarChar, title)
        .query("SELECT * FROM [dbo].[Story] WHERE [Title] = @title");
      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  },
  getByKeyword: async (keyword) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("keyword", sql.VarChar, `%${keyword}%`)
        .query(
          "Select * From [dbo].[Story] Where Lower(Title) Like '%' + Lower(@keyword) + '%'"
        );
      return result.recordset;
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  },
  getAll: async () => {
    try {
      let pool = await sql.connect(config);
      const result = await pool.request().query("SELECT * FROM [dbo].[Story]");
      return result.recordset;
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  },
  getGenreName: async (storyId) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("storyId", sql.Int, storyId)
        .query(
          "Select G.[Name] from [Genre] As G join [StoryGenre] AS SG On G.[ID] = SG.[GenreID] Where SG.[StoryID] = @storyId"
        );
      return result.recordset;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
  updateStory: async (
    storyId,
    title,
    author,
    description,
    imagePath,
    values
  ) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("storyId", sql.Int, storyId)
        .input("title", sql.VarChar, title)
        .input("author", sql.VarChar, author)
        .input("description", sql.NVarChar, description)
        .input("imagePath", sql.Text, imagePath)
        .query(
          `
          UPDATE [dbo].[Story] SET [title] = @title, [author] = @author, [description] = @description, [ImagePath] = @imagePath WHERE [ID] = @storyId
          DELETE FROM [dbo].[StoryGenre] WHERE [StoryId] = @storyId;
          INSERT INTO [dbo].[StoryGenre] ([StoryId], [GenreId]) VALUES ${values}
          `
        );
      return result.rowsAffected > 0;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
  updateStoryWithoutImage: async (
    storyId,
    title,
    author,
    description,
    values
  ) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("storyId", sql.Int, storyId)
        .input("title", sql.VarChar, title)
        .input("author", sql.VarChar, author)
        .input("description", sql.NVarChar, description).query(`
          UPDATE [dbo].[Story] SET [title] = @title, [author] = @author, [description] = @description WHERE [ID] = @storyId;
          DELETE FROM [dbo].[StoryGenre] WHERE [StoryId] = @storyId;
          INSERT INTO [dbo].[StoryGenre] ([StoryId], [GenreId]) VALUES ${values}
          `);
      return result.rowsAffected > 0;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
  addNewStory: async (title, author, description, imagePath) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("title", sql.VarChar, title)
        .input("author", sql.VarChar, author)
        .input("description", sql.NVarChar, description)
        .input("imagePath", sql.Text, imagePath)
        .query(
          "INSERT INTO [dbo].[Story] ([Title], [Author], [Description], [ImagePath]) VALUES (@title, @author, @description, @imagePath)"
        );
      return result.rowsAffected > 0;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
  addNewFavoriteStory: async (idStory, idUser) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("idStory", sql.Int, idStory)
        .input("idUser", sql.Int, idUser)
        .query(
          "INSERT INTO [dbo].[FavoritesList] ([UserID], [StoryID]) VALUES  (@idUser, @idStory)"
        );
      return result.rowsAffected > 0;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
  deleteFavoriteStory: async (idStory, idUser) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("idStory", sql.Int, idStory)
        .input("idUser", sql.Int, idUser)
        .query(
          "DELETE FROM [dbo].[FavoritesList] WHERE [StoryID] = @idStory AND [UserID] = @idUser"
        );
      return result.rowsAffected > 0;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
  getAllFavoriteStoryByIduser: async (idUser) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool.request().input("idUser", sql.Int, idUser).query(`
        SELECT S.ID, S.Title, S.Author, S.Description, S.UpdateDate, S.ChapterCount, S.ImagePath 
        FROM [dbo].[Story] as S LEFT Join [dbo].[FavoritesList] as FL 
        ON S.ID = FL.StoryID 
        WHERE FL.UserID = @idUser
      `);
      return result.recordset;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
  checkStoryFavoriteByidUser: async (idStory, idUser) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("idStory", sql.Int, idStory)
        .input("idUser", sql.Int, idUser)
        .query(
          "SELECT * FROM [dbo].[FavoritesList] WHERE [UserID] = @idUser AND [StoryID] = @idStory"
        );
      return result.recordset;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
};

module.exports = Story;
