const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    name: { type: String },
    id: { type: String, default: "" },
    participants: [
      {
        id: String, // user ID
        name: String, // user name
      },
    ],
    profilePic: { type: String, default: "" },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },

    // 🔽 New fields
    lastMessage: { type: String, default: "" },
    lastMessageTime: { type: Date },
    lastMessageSeen: {
      type: Map,
      of: Boolean,
      default: {}, // { userId1: true, userId2: false }
    },
    onlineStatus: {
      type: Map,
      of: Boolean,
      default: {}, // { userId1: true, userId2: false }
    },
  },
  { collection: "conversations" }
);

module.exports = mongoose.model("Conversation", conversationSchema);
