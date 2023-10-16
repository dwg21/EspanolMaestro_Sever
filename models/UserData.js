const mongoose = require("mongoose");

const UserDataSchema = new mongoose.Schema(
  {
    vocabularyCount: {
      type: [],
      default: [],
    },

    ConjugationCount: {
      type: Number,
      default: 0,
    },

    PastTranslations: {
      type: [],
      default: [],
    },

    newWords: {
      type: [],
      default: [],
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    Username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserData", UserDataSchema);
