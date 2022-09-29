const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true, min: 2 },
  lastname: { type: String, required: true, min: 3 },
  email: { type: String, unique: true, lowercase: true, required: true },
  hidden: { type: Boolean, default: false },
  password: { type: String, required: true, min: 6, max: 255 },
  date: {
    type: Date,
    trim: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
