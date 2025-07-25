const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// ✅ Create new conversation
router.post("/create_conversation", async (req, res) => {
  try {
    const {
      name,
      id,
      participants = [],
      profilePic = "",
      onlineStatus = {},
      lastMessage = "",
      lastMessageTime = null,
      lastMessageSeen = {},
    } = req.body;

    // Required: name
    if (!name) return res.status(400).json({ error: "Name is required" });

    const conversation = new Conversation({
      name,
      id,
      participants,
      profilePic,
      onlineStatus,
      lastMessage,
      lastMessageTime,
      lastMessageSeen,
    });

    await conversation.save();
    res.status(201).json(conversation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

// ✅ Get all conversations with their messages
router.get("/get_conversations", async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({ created_at: -1 });

    const result = await Promise.all(
      conversations.map(async (conv) => {
        const messages = await Message.find({
          conversation_id: conv._id,
          deleted: { $ne: true },
        }).sort({
          timestamp: 1, // ✅ oldest at top, latest at bottom
        });

        return {
          _id: conv._id,
          name: conv.name,
          id: conv.id,
          participants: conv.participants || [],
          profilePic: conv.profilePic || "",
          created_at: conv.created_at,
          updated_at: conv.updated_at,
          lastMessage: conv.lastMessage || "",
          lastMessageTime: conv.lastMessageTime || null,
          lastMessageSeen: conv.lastMessageSeen || {},
          onlineStatus: conv.onlineStatus || {},
          messages: messages.map((msg) => ({
            _id: msg._id,
            message: msg.message,
            sender: msg.sender,
            timestamp: msg.timestamp,
            date: msg.date,
            seen: msg.seen || {},
            seenAt: msg.seenAt || {},
            edited: msg.edited || false,
            deleted: msg.deleted || false,
          })),
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// ✅ Save new message
router.post("/send_message", async (req, res) => {
  try {
    const { conversation_id, message, sender, timestamp, date } = req.body;

    const newMessage = new Message({
      conversation_id,
      message,
      sender,
      timestamp,
      date,
      seen: {}, // default: no one has seen
      seenAt: {}, // default: empty
    });

    await newMessage.save();

    // Optional: Update conversation with last message
    await Conversation.findByIdAndUpdate(conversation_id, {
      lastMessage: message,
      lastMessageTime: new Date(),
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// DELETE a specific message by ID
router.delete("/delete_message/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json({ success: true, message: "Message deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

// DELETE an entire conversation by ID (including its messages)
router.delete("/delete_conversation/:conversationId", async (req, res) => {
  try {
    const { conversationId } = req.params;

    await Message.deleteMany({ conversation_id: conversationId });
    await Conversation.findByIdAndDelete(conversationId);

    res.status(200).json({ success: true, message: "Conversation deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});

// PATCH: Edit a specific message
router.patch("/edit_message/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    const { newText } = req.body;

    const updated = await Message.findByIdAndUpdate(
      messageId,
      { message: newText, edited: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ success: true, message: "Message updated", data: updated });
  } catch (err) {
    console.error("Edit message error:", err);
    res.status(500).json({ error: "Failed to edit message" });
  }
});

// PATCH: Soft delete a specific message
router.patch("/delete_message/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;

    const deleted = await Message.findByIdAndUpdate(
      messageId,
      { deleted: true },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ success: true, message: "Message deleted", data: deleted });
  } catch (err) {
    console.error("Delete message error:", err);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

router.post("/get_conversation_by_participants", async (req, res) => {
  try {
    const { participants } = req.body;

    if (!Array.isArray(participants) || participants.length !== 2) {
      return res
        .status(400)
        .json({ message: "Exactly 2 participants required" });
    }

    const sortedParticipantIds = participants.map((p) => p.id).sort();

    // Get all conversations where participants exist and are 2 in number
    const conversations = await Conversation.find({
      participants: { $exists: true },
    });

    const matchingConversations = conversations.filter((conv) => {
      if (!conv.participants || conv.participants.length !== 2) return false;
      const ids = conv.participants.map((p) => p.id).sort();
      return JSON.stringify(ids) === JSON.stringify(sortedParticipantIds);
    });

    // Sort by updated time
    const sorted = matchingConversations.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    // Use latest
    const conversation = sorted[0];

    // Delete duplicates
    const duplicates = sorted.slice(1);
    for (const dup of duplicates) {
      await Message.deleteMany({ conversation_id: dup._id });
      await Conversation.findByIdAndDelete(dup._id);
    }

    // Delete malformed conversations
    const malformed = conversations.filter(
      (conv) => !Array.isArray(conv.participants)
    );
    for (const m of malformed) {
      await Message.deleteMany({ conversation_id: m._id });
      await Conversation.findByIdAndDelete(m._id);
    }

    // Return existing conversation
    if (conversation) {
      const messages = await Message.find({
        conversation_id: conversation._id,
        deleted: { $ne: true },
      }).sort({ timestamp: 1 });

      return res.json({
        ...conversation.toObject(),
        messages,
      });
    }

    // Else: create new one
    const newConversation = new Conversation({ participants });
    await newConversation.save();

    return res.status(201).json({
      ...newConversation.toObject(),
      messages: [],
    });
  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
