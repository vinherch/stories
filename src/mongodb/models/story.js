const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  title: { type: String, required: true, min: 5 },
  description: { type: String, required: true, min: 10, max: 1024 },
  created: {
    type: Date,
    trim: true,
    default: Date.now,
  },
  updated: {
    type: Date,
    trim: true,
    default: Date.now,
  },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Story", storySchema);
