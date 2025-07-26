const mongoose = require("mongoose");

const project = new mongoose.Schema({
  user_info_id: { type: mongoose.Schema.Types.ObjectId, ref: "UserInfo" },
  name: String,
  description: String,
  technologies: [String],
  link: String,
  image: String,
});

module.exports = mongoose.model("Project", project);
