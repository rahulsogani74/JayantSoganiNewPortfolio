const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const models = require("../models"); // auto imports all models

// GET /data?model=User&id=64f...xyz
// GET /data?model=Conversation&limit=5
// GET /data?model=Message&conversation_id=abc123

// /data?model=User&limit=10&id=xyz&conversation_id=abc
router.get("/data", async (req, res) => {
  try {
    const { model, limit, ...filters } = req.query;

    if (!model || !models[model])
      return res.status(400).json({ error: "Invalid or missing model name" });

    const M = models[model];

    // Convert _id and ObjectId fields
    if (filters.id) {
      filters._id = new mongoose.Types.ObjectId(filters.id);
      delete filters.id;
    }

    if (filters.conversation_id) {
      filters.conversation_id = filters.conversation_id.toString();
    }

    const query = M.find(filters).sort({ createdAt: -1 });
    if (limit) query.limit(Number(limit));

    const result = await query.exec();

    res.json(result);
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
