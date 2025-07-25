const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    conversation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    type: { type: String, enum: ["new_message", "mention", "typing"] },
    isRead: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "notifications" }
);

module.exports = mongoose.model("Notification", notificationSchema);
