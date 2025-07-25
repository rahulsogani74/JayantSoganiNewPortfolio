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

io.on("connection", (socket) => {
  console.log("🔌 New socket connected:", socket.id);

  socket.on("typing", ({ conversation_id, sender }) => {
    socket.broadcast.emit("typing", { conversation_id, sender });
  });

  socket.on("stop_typing", ({ conversation_id, sender }) => {
    socket.broadcast.emit("stop_typing", { conversation_id, sender });
  });

  socket.on("join", ({ user_type, user_id }) => {
    io.emit("user_status", { user_id, status: "online" });
    if (user_type === "visitor") {
      activeConnections.visitors[user_id] = socket.id;
      console.log(`👤 Visitor ${user_id} joined (SID: ${socket.id})`);
    } else if (user_type === "owner") {
      activeConnections.owner = socket.id;
      console.log(`👑 Owner joined (SID: ${socket.id})`);
    }
  });

  socket.on("send_message", async (data) => {
    try {
      const { conversation_id, message, sender, timestamp, date } = data;

      if (!ObjectId.isValid(conversation_id)) {
        console.log("❌ Invalid conversation_id:", conversation_id);
        return socket.emit("error", { error: "Invalid conversation ID" });
      }

      const savedMessage = await Message.create({
        conversation_id: conversation_id,
        message,
        sender,
        timestamp: timestamp || new Date().toISOString(),
        date: date || new Date().toISOString(),
      });

      const messageData = {
        ...savedMessage.toObject(),
        _id: savedMessage._id.toString(),
      };

      console.log("💬 Message saved:", messageData);
      io.emit("receive_message", messageData);
    } catch (err) {
      console.error("❌ Error in send_message:", err);
      socket.emit("error", { error: "Failed to process message" });
    }
  });

  io.on("connection", (socket) => {
    console.log("🔌 New socket connected:", socket.id);

    socket.on("join", ({ user_type, user_id, conversation_id }) => {
      socket.join(conversation_id);
      socket.user_id = user_id;
      socket.conversation_id = conversation_id;

      io.emit("user_status", { user_id, status: "online" });

      if (user_type === "visitor") {
        activeConnections.visitors[user_id] = socket.id;
        console.log(`👤 Visitor ${user_id} joined`);
      } else if (user_type === "owner") {
        activeConnections.owner = socket.id;
        console.log(`👑 Owner joined`);
      }
    });

    socket.on("send_message", async (data) => {
      try {
        const { conversation_id, message, sender, timestamp, date } = data;

        if (!ObjectId.isValid(conversation_id)) {
          console.log("❌ Invalid conversation_id:", conversation_id);
          return socket.emit("error", { error: "Invalid conversation ID" });
        }

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

        io.to(conversation_id).emit("receive_message", messageData);
      } catch (err) {
        console.error("❌ Error in send_message:", err);
        socket.emit("error", { error: "Failed to process message" });
      }
    });

    socket.on("seen_message", ({ conversation_id }) => {
      console.log(`👁️ Message seen in conversation: ${conversation_id}`);
      io.to(conversation_id).emit("message_seen", { conversation_id });
    });

    socket.on("typing", ({ conversation_id, sender }) => {
      socket.to(conversation_id).emit("typing", { sender });
    });

    socket.on("stop_typing", ({ conversation_id, sender }) => {
      socket.to(conversation_id).emit("stop_typing", { sender });
    });

    // 📝 Edit Message
    socket.on("edit_message", async ({ messageId, newText }) => {
      const updated = await Message.findByIdAndUpdate(
        messageId,
        { text: newText, edited: true },
        { new: true }
      );
      if (updated) {
        io.emit("message_edited", updated);
      }
    });

    // 🗑️ Delete Message
    socket.on("delete_message", async ({ messageId }) => {
      const updated = await Message.findByIdAndUpdate(
        messageId,
        { text: "This message was deleted", deleted: true },
        { new: true }
      );
      if (updated) {
        io.emit("message_deleted", updated);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected:", socket.id);

      if (socket.user_id) {
        console.log("user_status", {
          user_id: socket.user_id,
          status: "offline",
        });

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
});

// ------------------ START SERVER ------------------ //

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  });
});
