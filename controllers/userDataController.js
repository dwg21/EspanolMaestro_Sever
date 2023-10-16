const UserData = require("../models/UserData");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../models/User");

const getSingleUserData = async (req, res) => {
  const data = await UserData.find({ user: req.user.userId });
  if (!data) {
    throw new CustomError.NotFoundError("No user details found ");
  }
  res.status(StatusCodes.OK).json({ data });
};

const updateUserData = async (req, res) => {
  const {
    newVocabualry,
    verbsConjuagted,
    translation,
    newWords,
    editedNewWords,
  } = req.body;
  console.log(verbsConjuagted);
  const data = await UserData.findOne({ user: req.user.userId });
  if (!data) {
    throw new CustomError.NotFoundError("No user details found ");
  }

  //ensures no duplcates in array before saving

  if (newVocabualry) {
    const newVocabularyCount = [...data.vocabularyCount, ...newVocabualry];
    const vocabularyCountWithoutDuplicates = [...new Set(newVocabularyCount)];
    data.vocabularyCount = vocabularyCountWithoutDuplicates;
  }
  if (verbsConjuagted) {
    data.ConjugationCount += Number(verbsConjuagted);
  }

  if (translation) {
    data.PastTranslations = [...data.PastTranslations, translation];
  }

  if (newWords) {
    data.newWords = [...new Set([...data.newWords, ...newWords])]; // Remove duplicates
  }

  if (editedNewWords) {
    console.log(editedNewWords);
    data.newWords = editedNewWords;
  }

  await data.save();
  res.status(StatusCodes.OK).json({ data });
};

module.exports = {
  getSingleUserData,
  updateUserData,
};
