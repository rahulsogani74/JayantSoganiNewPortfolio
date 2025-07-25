const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    message: String,
    sender: {
      id: String, // e.g., "987"
      name: String, // e.g., "Jayant Sogani"
    },
    timestamp: String,
    date: String,
    seen: { type: Object, default: {} },
    seenAt: { type: Object, default: {} },
    edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
  },
  { collection: "messages" }
);

module.exports = mongoose.model("Message", messageSchema);
