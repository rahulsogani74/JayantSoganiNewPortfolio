const mongoose = require("mongoose");

const education = new mongoose.Schema({
  user_info_id: { type: mongoose.Schema.Types.ObjectId, ref: "UserInfo" },
  degree: String,
  institution: String,
  description: String,
  year: String,
});

module.exports = mongoose.model("education", education);
