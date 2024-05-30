const fs = require("fs");
const path = require("path");

const StoryModel = require("../models/story.model");
const UserModel = require("../models/user.model");
const GenreModel = require("../models/genre.model");
const ChapterModel = require("../models/chapter.model");
const CommentModel = require("../models/comment.model");

const displayAddChapter = async (req, res) => {
  const user = res.locals.user;
  const idStory = req.params.id;
  const titleStory = req.params.title;
  const userData = await UserModel.getById(user.ID);
  res.render("admin/pages/addChapter", {
    name: userData.Username,
    idStory: idStory,
    titleStory: titleStory,
  });
};

const addNewChapter = async (req, res) => {
  const idStory = req.body.idStory;
  const titleStory = (await StoryModel.getTitleById(idStory)).Title;
  const titleChapter =
    titleStory.toString().toUpperCase() + " " + req.body.nameChapter;
  const updateDate = new Date(Date.now());
  const day = updateDate.getDate().toString().padStart(2, "0");
  const month = (updateDate.getMonth() + 1).toString().padStart(2, "0");
  const year = updateDate.getFullYear().toString();
  const hours = updateDate.getHours().toString().padStart(2, "0");
  const minutes = updateDate.getMinutes().toString().padStart(2, "0");

  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
  await ChapterModel.addChapter(titleChapter, idStory, formattedDate);
  res.redirect(`/adminDashboard/${idStory}/${titleStory}`);
};

const displayUpdateChapter = async (req, res) => {
  const idStory = req.params.idStory;
  const titleStory = req.params.titleStory;
  const nameChapter = req.params.nameChapter;
  const idChapter = parseInt(
    (await ChapterModel.getIdChapterByNameANDStoryID(nameChapter, idStory)).ID
  );
  const listImageInChapter = await ChapterModel.getListImageinChapter(
    idChapter
  );

  const user = res.locals.user;
  const userData = await UserModel.getById(user.ID);
  res.render("admin/pages/updateChapter", {
    name: userData.Username,
    idStory: idStory,
    titleStory: titleStory,
    nameChapter: nameChapter,
    idChapter: idChapter,
    listImageInChapter: listImageInChapter,
  });
};

const updateChapter = async (req, res) => {
  const idStory = req.params.idStory;
  const titleStory = req.params.titleStory;
  const nameChapter = req.body.nameChapter;
  const idChapter = parseInt(req.body.idChapter);
  const nameImageInChapter = req.body.nameImageInChapter.split("/");
  const valuesNameImageToDelete =
    "(" +
    nameImageInChapter
      .map((nameImageDelete) => `'${nameImageDelete}'`)
      .join(", ") +
    ")";
  const updateDate = new Date(Date.now());
  const day = updateDate.getDate().toString().padStart(2, "0");
  const month = (updateDate.getMonth() + 1).toString().padStart(2, "0");
  const year = updateDate.getFullYear().toString();
  const hours = updateDate.getHours().toString().padStart(2, "0");
  const minutes = updateDate.getMinutes().toString().padStart(2, "0");

  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
  if (req.files.length > 0) {
    var index = 1;
    req.files.map((file) => {
      const paths = file.path.split("\\");
      // const newFileName = `image_${index}` + path.extname(file.originalname);
      const newPath = `${paths[0]}\\${paths[1]}\\${paths[2]}\\${paths[3]}\\${paths[4]}\\${file.filename}`;
      fs.renameSync(file.path, newPath);
      // file.filename = newFileName;
      file.path = `/${paths[1]}/${paths[2]}/${paths[3]}/${paths[4]}/${file.filename}`;
      index += 1;
    });

    const values = req.files
      .map((file) => `(${idChapter}, '${file.filename}', '${file.path}')`)
      .join(", ");

    await ChapterModel.updateChapter(
      idChapter,
      nameChapter,
      values,
      formattedDate,
      valuesNameImageToDelete
    );
  } else {
    await ChapterModel.updateChapterWithoutImage(
      idChapter,
      nameChapter,
      formattedDate,
      valuesNameImageToDelete
    );
  }
  res.redirect(`/adminDashboard/${idStory}/${titleStory}`);
};

const displayChapterUser = async (req, res) => {
  const idStory = req.params.id;
  const titleStory = req.params.title;
  const nameChapter = req.params.chapter;
  const idChapter = parseInt(
    (await ChapterModel.getIdChapterByNameANDStoryID(nameChapter, idStory)).ID
  );
  const listImageInChapter = await ChapterModel.getListImageinChapter(
    idChapter
  );

  const listChapter = await ChapterModel.getAllChapterByStoryId(idStory);

  const user = res.locals.user;
  const userData = await UserModel.getById(user.ID);

  const allComment = await CommentModel.getAllCommentByChapterId(idChapter);
  res.render("user/pages/detailsChapter", {
    name: userData.Username,
    idStory: idStory,
    titleStory: titleStory,
    nameChapter: nameChapter,
    idChapter: idChapter,
    listImageInChapter: listImageInChapter,
    listChapter: listChapter,
    allComment: allComment,
  });
};

module.exports = {
  addNewChapter,
  displayUpdateChapter,
  updateChapter,
  displayChapterUser,
};
