const mongoose = require("mongoose");

const presenceSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    displayName: { type: String },
    avatar: { type: String, default: "" },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date },
    isTypingIn: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  },
  { collection: "presence" }
);

module.exports = mongoose.model("Presence", presenceSchema);
