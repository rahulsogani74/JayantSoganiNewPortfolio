const mongoose = require("mongoose");

const socialLink = new mongoose.Schema({
  user_info_id: { type: mongoose.Schema.Types.ObjectId, ref: "UserInfo" },
  platform: String,
  url: String,
});

module.exports = mongoose.model("social_link", socialLink);
