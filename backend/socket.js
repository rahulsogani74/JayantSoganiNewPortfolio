const { Server } = require("socket.io");
const { ObjectId } = require("mongodb");
const Message = require("./models/Message");

const activeConnections = {
  visitors: {},
  owner: null,
};

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // ✅ React client origin
      methods: ["GET", "POST"],
      credentials: true,
    },
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

      socket.emit("joined", { status: "ok", room: conversation_id });
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

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected:", socket.id);

      if (socket.user_id) {
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

  return io;
}

module.exports = setupSocket;
