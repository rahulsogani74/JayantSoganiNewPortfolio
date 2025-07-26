const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  image: String, // store as base64
  description: String,
  link: String,
  seen: Boolean,
  order: Number,
});

module.exports = mongoose.model("Ad", adSchema);
