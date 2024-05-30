const sql = require("mssql");
const config = require("../connect_sql");

const Genre = {
  getById: async (genreId) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("genreId", sql.Int, genreId)
        .query("SELECT * FROM [dbo].[Genre] WHERE [ID] = @genreId");
      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  },
  getByName: async (name) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("name", sql.VarChar, name)
        .query("SELECT * FROM [dbo].[Genre] WHERE [ID] = @genreId");
      return result.recordset.length > 0 ? result.recordset[0] : null;
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  },
  getAll: async () => {
    try {
      let pool = await sql.connect(config);
      const result = await pool.request().query("SELECT * FROM [dbo].[Genre]");
      return result.recordset;
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  },
  getStory: async (genreName) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("genreName", sql.VarChar, genreName)
        .query(`SELECT S.ID, S.Title, S.Author, S.Description, S.UpdateDate, S.ChapterCount, S.ImagePath
                FROM [dbo].[Story] AS S
                JOIN [dbo].[StoryGenre] as SG on S.ID = SG.StoryID
                JOIN [dbo].[Genre] as G on G.ID = SG.GenreID
                WHERE G.Name = @genreName`);
      return result.recordset;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
};

module.exports = Genre;
