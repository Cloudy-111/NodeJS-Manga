const CommentModel = require("../models/comment.model");
const UserModel = require("../models/user.model");

const addNewComment = async (req, res) => {
  const user = res.locals.user;

  const userData = await UserModel.getById(user.ID);
  const storyId = parseInt(req.body.storyId);
  const commentContext = req.body.comment;

  const addDate = new Date(Date.now());
  const day = addDate.getDate().toString().padStart(2, "0");
  const month = (addDate.getMonth() + 1).toString().padStart(2, "0");
  const year = addDate.getFullYear().toString();
  const hours = addDate.getHours().toString().padStart(2, "0");
  const minutes = addDate.getMinutes().toString().padStart(2, "0");

  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

  await CommentModel.createComment(
    userData.ID,
    storyId,
    commentContext,
    formattedDate
  );
  res.sendStatus(200);
};

const addNewCommentinChapter = async (req, res) => {
  const user = res.locals.user;

  const userData = await UserModel.getById(user.ID);
  const storyId = parseInt(req.params.id);
  const commentContext = req.body.comment;
  const chapterId = parseInt(req.params.idChapter);

  const addDate = new Date(Date.now());
  const day = addDate.getDate().toString().padStart(2, "0");
  const month = (addDate.getMonth() + 1).toString().padStart(2, "0");
  const year = addDate.getFullYear().toString();
  const hours = addDate.getHours().toString().padStart(2, "0");
  const minutes = addDate.getMinutes().toString().padStart(2, "0");

  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

  await CommentModel.createCommentinChapter(
    userData.ID,
    storyId,
    commentContext,
    formattedDate,
    chapterId
  );
  res.sendStatus(200);
};

module.exports = {
  addNewComment,
  addNewCommentinChapter,
};
