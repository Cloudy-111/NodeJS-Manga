const sql = require("mssql");
const config = require("../connect_sql");

const Comment = {
  createComment: async (userId, storyId, content, postDate) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("userId", sql.Int, userId)
        .input("storyId", sql.Int, storyId)
        .input("content", sql.Text, content)
        .input("postDate", sql.Text, postDate)
        .query(
          "INSERT INTO [dbo].[Comment] VALUES (@userId, @storyId, @content, @postDate, null)"
        );
      return result.rowsAffected > 0;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
  createCommentinChapter: async (
    userId,
    storyId,
    content,
    postDate,
    chapterId
  ) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool
        .request()
        .input("userId", sql.Int, userId)
        .input("storyId", sql.Int, storyId)
        .input("chapterId", sql.Int, chapterId)
        .input("content", sql.Text, content)
        .input("postDate", sql.Text, postDate)
        .query(
          "INSERT INTO [dbo].[Comment] VALUES (@userId, @storyId, @content, @postDate, @chapterId)"
        );
      return result.rowsAffected > 0;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
  getAllCommentByStoryId: async (storyId) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool.request().input("storyId", sql.Int, storyId)
        .query(`
          SELECT C.StoryID, CH.Title, C.UserID, C.Content, U.Username, C.PostDate 
          FROM [dbo].[Comment] AS C Join [dbo].[Userr] AS U 
          ON C.UserID = U.ID 
          LEFT Join [dbo].[Chapter] AS CH
          ON c.ChapterID = CH.ID
          WHERE C.StoryID = @storyId
        `);
      return result.recordset;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
  getAllCommentByChapterId: async (chapterId) => {
    try {
      let pool = await sql.connect(config);
      let result = await pool.request().input("chapterId", sql.Int, chapterId)
        .query(`
          SELECT C.ChapterID, CH.Title, C.UserID, C.Content, U.Username, C.PostDate 
          FROM [dbo].[Comment] AS C Join [dbo].[Userr] AS U 
          ON C.UserID = U.ID
          Join [dbo].[Chapter] AS CH
          ON c.ChapterID = CH.ID
          WHERE C.ChapterID = @chapterId
        `);
      return result.recordset;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
};

module.exports = Comment;
