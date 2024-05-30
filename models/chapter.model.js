const sql = require("mssql");
const config = require("../connect_sql");

const Chapter = {
  addChapter: async (title, storyId, addDate) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("title", sql.VarChar, title)
        .input("storyId", sql.Int, storyId)
        .input("addDate", sql.Text, addDate)
        .query(
          "INSERT INTO [dbo].[Chapter] VALUES(null, @title, null, @addDate, @storyId)"
        );
      return result.rowsAffected > 0;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
  getAllChapterByStoryId: async (storyId) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("storyId", sql.Int, storyId)
        .query("SELECT * FROM [dbo].[Chapter] WHERE [StoryID] = @storyId");
      return result.recordset;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
  getIdChapterByNameANDStoryID: async (nameChapter, idStory) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("idStory", sql.Int, idStory)
        .input("nameChapter", sql.VarChar, nameChapter)
        .query(
          "SELECT [ID] FROM [dbo].[Chapter] WHERE [Title] = @nameChapter AND [StoryID] = @idStory"
        );
      return result.recordset[0];
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
  updateChapter: async (
    idChapter,
    nameChapter,
    values,
    updateDate,
    valuesNameImageToDelete
  ) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("idChapter", sql.Int, idChapter)
        .input("nameChapter", sql.VarChar, nameChapter)
        .input("updateDate", sql.VarChar, updateDate)
        .query(
          `
          UPDATE [dbo].[Chapter] SET [Title] = @nameChapter, [UpdateDate] = @updateDate WHERE [ID] = @idChapter;
          INSERT INTO [dbo].[ImageinChapter] ([idChapter], [filename], [path]) VALUES ${values}
          DELETE FROM ImageinChapter WHERE [filename] IN ${valuesNameImageToDelete}
          `
        );
      return result.rowsAffected > 0;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
  updateChapterWithoutImage: async (
    idChapter,
    nameChapter,
    updateDate,
    valuesNameImageToDelete
  ) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("idChapter", sql.Int, idChapter)
        .input("nameChapter", sql.VarChar, nameChapter)
        .input("updateDate", sql.VarChar, updateDate)
        .query(
          `
          UPDATE [dbo].[Chapter] SET [Title] = @nameChapter, [UpdateDate] = @updateDate WHERE [ID] = @idChapter;
          DELETE FROM ImageinChapter WHERE [filename] IN ${valuesNameImageToDelete}
          `
        );
      return result.rowsAffected > 0;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
  getListImageinChapter: async (idChapter) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("idChapter", sql.Int, idChapter)
        .query(
          "SELECT * FROM [dbo].[ImageinChapter] WHERE [idChapter] = @idChapter"
        );
      return result.recordset;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
};

module.exports = Chapter;
