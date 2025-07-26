const mongoose = require("mongoose");

const skill = new mongoose.Schema({
  user_info_id: { type: mongoose.Schema.Types.ObjectId, ref: "UserInfo" },
  name: String,
});

module.exports = mongoose.model("Skill", skill);
