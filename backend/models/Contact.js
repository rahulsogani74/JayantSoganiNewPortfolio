const mongoose = require("mongoose");

const contact = new mongoose.Schema({
  user_info_id: { type: mongoose.Schema.Types.ObjectId, ref: "UserInfo" },
  type: String,
  value: String,
});

module.exports = mongoose.model("Contact", contact);
