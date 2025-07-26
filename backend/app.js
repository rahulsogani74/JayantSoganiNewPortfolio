require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { ObjectId } = require("mongodb");

const connectDB = require("./config/db");
const setupSocket = require("./socket");

// Route Imports
const userRoutes = require("./routes/user_info_routes");
const adsRoutes = require("./routes/ads_routes");
const conversationRoutes = require("./routes/conversations");
const chatDynamicRoutes = require("./routes/dynamic");
const chatRoutes = require("./routes/chatRoutes");
const Conversation = require("./models/Conversation");
const Message = require("./models/Message");

// App & Server Init
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Middlewares
app.use(cors());
app.use(express.json());

app.use(conversationRoutes);
app.use("/api", chatRoutes);
app.use("/api", require("./routes/dynamic"));

// Use routes
app.use(adsRoutes);
app.use(userRoutes);

// Track active connections
const activeConnections = {
  visitors: {},
  owner: null,
};

// ------------------ SOCKET.IO ------------------ //

// Instead of repeating `io.on("connection"...` twice, merge everything inside one block
io.on("connection", (socket) => {
  console.log("🔌 [SERVER] Socket connected:", socket.id);

  socket.on("typing", ({ conversation_id, sender }) => {
    console.log("📝 [SERVER] Typing from:", sender, "in", conversation_id);
    socket.to(conversation_id).emit("typing", { sender });
  });

  socket.on("stop_typing", ({ conversation_id, sender }) => {
    console.log("✋ [SERVER] Stop typing from:", sender, "in", conversation_id);
    socket.to(conversation_id).emit("stop_typing", { sender });
  });

  socket.on("join", ({ user_type, user_id, conversation_id }) => {
    if (!conversation_id) {
      console.warn(
        `⚠️ [SERVER] join called without conversation_id. User ID: ${user_id}, Type: ${user_type}`
      );
      return;
    }

    socket.join(conversation_id);
    socket.user_id = user_id;
    socket.user_type = user_type;
    socket.conversation_id = conversation_id;

    console.log(
      `👋 [SERVER] ${user_type} (${user_id}) joined ${conversation_id}`
    );

    io.emit("user_status", { user_id, status: "online" });

    if (user_type === "visitor") {
      activeConnections.visitors[user_id] = socket.id;
    } else if (user_type === "owner") {
      activeConnections.owner = socket.id;
    }
  });

  socket.on("send_message", async (data) => {
    console.log("📨 [SERVER] send_message received:", data);
    const { conversation_id, message, sender, timestamp, date } = data;

    if (!ObjectId.isValid(conversation_id)) {
      console.log("❌ [SERVER] Invalid conversation_id:", conversation_id);
      return socket.emit("error", { error: "Invalid conversation ID" });
    }

    try {
      const savedMessage = await Message.create({
        conversation_id,
        message,
        sender,
        timestamp: timestamp || new Date().toISOString(),
        date: date || new Date().toISOString(),
      });

      const messageData = {
        ...savedMessage.toObject(),
        _id: savedMessage._id.toString(),
        seen: false,
        delivered: true,
      };

      console.log("✅ [SERVER] Message saved:", messageData);
      io.to(conversation_id).emit("receive_message", messageData);
    } catch (err) {
      console.error("❌ [SERVER] send_message error:", err);
      socket.emit("error", { error: "Failed to process message" });
    }
  });

  socket.on("edit_message", async ({ messageId, newText }) => {
    console.log("✏️ [SERVER] Edit message:", messageId, newText);
    const updated = await Message.findByIdAndUpdate(
      messageId,
      { text: newText, edited: true },
      { new: true }
    );
    if (updated) {
      io.emit("message_edited", updated);
    }
  });

  socket.on("delete_message", async ({ messageId }) => {
    console.log("🗑️ [SERVER] Delete message:", messageId);
    const updated = await Message.findByIdAndUpdate(
      messageId,
      { text: "This message was deleted", deleted: true },
      { new: true }
    );
    if (updated) {
      io.emit("message_deleted", updated);
    }
  });

  socket.on("seen_message", ({ conversation_id }) => {
    console.log("👁️ [SERVER] Seen message in conversation:", conversation_id);
    io.to(conversation_id).emit("message_seen", { conversation_id });
  });

  socket.on("disconnect", () => {
    console.log("🔌 [SERVER] Socket disconnected:", socket.id);

    if (socket.user_id) {
      console.log(
        `📴 [SERVER] Disconnected user => ID: ${socket.user_id}, Type: ${socket.user_type}, SocketID: ${socket.id}`
      );

      io.emit("user_status", { user_id: socket.user_id, status: "offline" });
    }

    for (const [uid, sid] of Object.entries(activeConnections.visitors)) {
      if (sid === socket.id) {
        delete activeConnections.visitors[uid];
      }
    }

    if (activeConnections.owner === socket.id) {
      activeConnections.owner = null;
    }
  });
});

// ------------------ START SERVER ------------------ //

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  });
});
