// models/UserInfo.js
const mongoose = require("mongoose");

const userInfo = new mongoose.Schema({
  name: String,
  photo: String,
  title: String,
  description: String,
});

const UserInfo = mongoose.model("userinfo", userInfo);

module.exports = UserInfo;
