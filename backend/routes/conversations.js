const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const connectDB = require("../config/db");

// GET /get_conversations
router.get("/get_conversations", async (req, res) => {
  try {
    const db = await connectDB();
    const conversationsCollection = db.collection("conversations");
    const messagesCollection = db.collection("messages");

    const conversations = await conversationsCollection
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    if (!conversations.length)
      return res.status(404).json({ message: "No conversations found" });

    // Fetch last 10 messages per conversation
    for (let conv of conversations) {
      const convIdStr = conv._id.toString();

      const messages = await messagesCollection
        .find({ conversation_id: convIdStr })
        .sort({ timestamp: -1 })
        .limit(10)
        .toArray();

      conv._id = convIdStr;
      conv.messages = messages.map((msg) => ({
        ...msg,
        _id: msg._id.toString(),
      }));
    }

    res.status(200).json(conversations);
  } catch (err) {
    console.error("❌ Error fetching conversations:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /create_conversation
router.post("/create_conversation", async (req, res) => {
  try {
    const db = await connectDB();
    const conversationsCollection = db.collection("conversations");

    const { name = "Visitor Chat", profilePic = "" } = req.body;

    const existing = await conversationsCollection.findOne({ name });
    if (existing) {
      existing._id = existing._id.toString();
      return res.status(200).json(existing);
    }

    const conversation = {
      name,
      profilePic,
      created_at: new Date(),
    };

    const result = await conversationsCollection.insertOne(conversation);
    conversation._id = result.insertedId.toString();

    console.log("✅ Conversation created:", conversation);
    res.status(201).json(conversation);
  } catch (err) {
    console.error("❌ Error creating conversation:", err);
    res
      .status(500)
      .json({ error: "Failed to create conversation", details: err.message });
  }
});

module.exports = router;
