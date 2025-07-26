const mongoose = require("mongoose");

const experience = new mongoose.Schema({
  user_info_id: { type: mongoose.Schema.Types.ObjectId, ref: "UserInfo" },
  year: String,
  description: String,
  position: String,
  company: String,
  title: String,
});

module.exports = mongoose.model("Experience", experience);
