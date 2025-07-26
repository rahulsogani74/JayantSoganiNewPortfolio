// MainMessages.jsx
import React, { useEffect, useRef, useState } from "react";
import PortfolioOwnerMessages from "./PortfolioOwnerMessages";
import VisitorMessages from "./VisitorMessages";
import { io } from "socket.io-client";
import visitors from "../data/visitor.json";
import ownerData from "../data/owner.json";
import "./Messaging.css";

const SOCKET_URL = "http://localhost:5000";

const MainMessages = () => {
  const socketRef = useRef(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [visitorMessages, setVisitorMessages] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  // Format messages as needed for state
  const formatMessages = (messages) =>
    Array.isArray(messages)
      ? messages.map((msg) => ({
          _id: msg._id,
          text: msg.message,
          sender: msg.sender,
          time: msg.timestamp,
          date: msg.date,
          delivered: true,
          seen: false,
          edited: msg.edited,
          deleted: msg.deleted,
        }))
      : [];

  // Update messages in state when edited/deleted
  const updateMessageInState = (msg) => {
    setVisitorMessages((prev) =>
      prev.map((m) => (m._id === msg._id ? msg : m))
    );
    setConversations((prev) =>
      prev.map((conv) => ({
        ...conv,
        messages: conv.messages.map((m) => (m._id === msg._id ? msg : m)),
      }))
    );
  };

  // Handle receiving a new message
  const handleIncomingMessage = (messageData) => {
    const newMessage = {
      _id: messageData._id || Math.random().toString(36),
      text: messageData.message,
      time: messageData.timestamp,
      date: messageData.date,
      delivered: true,
      seen: false,
      sender: messageData.sender,
      edited: messageData.edited,
      deleted: messageData.deleted,
    };

    setVisitorMessages((prevMessages) => {
      const exists = prevMessages.some(
        (msg) => msg.text === newMessage.text && msg.time === newMessage.time
      );
      return exists ? prevMessages : [...prevMessages, newMessage];
    });

    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv._id === messageData.conversation_id
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: messageData.message,
              time: messageData.timestamp,
              date: messageData.date,
            }
          : conv
      )
    );
  };

  // Fetch all conversations from API
  const fetchConversations = async () => {
    try {
      const res = await fetch(`${SOCKET_URL}/api/get_conversations`);
      const data = (await res.json()).reverse();

      if (data.length > 0) {
        const formatted = data.map((conv) => ({
          ...conv,
          messages: formatMessages(conv.messages),
          seen: false,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date().toISOString().split("T")[0],
        }));

        formatted.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );

        setConversations(formatted);
        setActiveConversation(0);
        if (data[0].messages) {
          setVisitorMessages(formatMessages(data[0].messages));
        }
      }
    } catch (error) {
      console.error("❌ Failed to fetch conversations:", error);
    }
  };

  // Send message
  const handleSendMessage = (message, senderId, senderName) => {
    const socket = socketRef.current;
    if (!socket || conversations.length === 0) return;

    const conversationId = conversations[activeConversation || 0]._id;
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const date = new Date().toISOString().split("T")[0];

    const messageData = {
      conversation_id: conversationId,
      message,
      sender: { id: senderId, name: senderName },
      timestamp,
      date,
    };

    // console.log("🚀 Sending message:", messageData);
    socket.emit("send_message", messageData);
  };

  // Switch conversations when a visitor is selected
  const handleConversationClick = async (index) => {
    const visitor = visitors[index];
    setSelectedVisitor(visitor);

    const participants = [
      { id: ownerData.id.toString(), name: ownerData.name },
      { id: visitor.id.toString(), name: visitor.name },
    ];

    try {
      const response = await fetch(
        `${SOCKET_URL}/api/get_conversation_by_participants`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ participants }),
        }
      );

      const data = await response.json();

      if (response.ok && data && data._id) {
        setConversations([data]);
        setVisitorMessages(formatMessages(data.messages || []));
        setActiveConversation(0);
        // ✅ Emit join after getting conversation_id
        socketRef.current.emit("join", {
          user_type: "owner",
          user_id: ownerData.id,
          user_name: ownerData.name,
          conversation_id: data._id, // Send this!
        });
      }
    } catch (error) {
      console.error("❌ Error fetching conversation:", error);
    }
  };

  // Edit message
  const handleEditMessage = async (index, newText) => {
    const oldMsg = visitorMessages[index];
    if (!newText || newText === oldMsg.text) return;

    try {
      const res = await fetch(`${SOCKET_URL}/api/edit_message/${oldMsg._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newText }),
      });

      const updatedMsg = {
        ...oldMsg,
        text: newText,
        edited: true,
      };

      updateMessageInState(updatedMsg);
      socketRef.current?.emit("edit_message", updatedMsg);
    } catch (err) {
      console.error("❌ Edit message failed:", err);
    }
  };

  // Delete message
  const handleDeleteMessage = async (index) => {
    const msg = visitorMessages[index];
    if (!window.confirm("Delete this message?")) return;

    try {
      const res = await fetch(`${SOCKET_URL}/api/delete_message/${msg._id}`, {
        method: "PATCH",
      });

      const updatedMsg = {
        ...msg,
        text: "This message was deleted",
        deleted: true,
      };

      updateMessageInState(updatedMsg);
      socketRef.current?.emit("delete_message", updatedMsg);
    } catch (err) {
      console.error("❌ Delete message failed:", err);
    }
  };

  // Delete whole conversation
  const handleClearChat = async () => {
    const conversationId = conversations[activeConversation || 0]?._id;
    if (!conversationId) return;

    try {
      const res = await fetch(
        `${SOCKET_URL}/api/delete_conversation/${conversationId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      const updatedConvs = conversations.filter(
        (conv) => conv._id !== conversationId
      );
      setConversations(updatedConvs);
      setVisitorMessages([]);
      setActiveConversation(updatedConvs.length ? 0 : null);
    } catch (err) {
      console.error("❌ Clear chat error:", err);
    }
  };

  // --- SOCKET INITIALIZATION: only ONCE ---
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on("connect", () => {
        console.log("🔌 [CLIENT] Connected:", socketRef.current.id);
        socketRef.current.emit("join", {
          user_name: ownerData.name,
          user_id: ownerData.id,
          user_type: "owner",
        });
      });

      socketRef.current.on("receive_message", (data) => {
        console.log("📥 [CLIENT] Received message:", data);
        handleIncomingMessage(data);
      });

      socketRef.current.on("message_deleted", (msg) => {
        console.log("🗑️ [CLIENT] Message deleted:", msg);
        updateMessageInState(msg);
      });

      socketRef.current.on("message_edited", (msg) => {
        console.log("✏️ [CLIENT] Message edited:", msg);
        updateMessageInState(msg);
      });

      socketRef.current.on("typing", (data) => {
        console.log("📝 [CLIENT] Typing event:", data);
      });

      socketRef.current.on("stop_typing", (data) => {
        console.log("✋ [CLIENT] Stop typing event:", data);
      });

      socketRef.current.on("user_status", ({ user_id, status }) => {
        console.log("🔄 [CLIENT] User status change:", user_id, status);
      });
    }

    fetchConversations();

    return () => {
      if (socketRef.current) {
        console.log(
          `🔌 [CLIENT] Disconnecting socket: ${socketRef.current.id}, user_id: ${ownerData.id}, name: ${ownerData.name}`
        );
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <div className="messaging-app">
      <div className="messaging-layout">
        <PortfolioOwnerMessages
          visitors={visitors}
          onConversationClick={handleConversationClick}
          conversations={conversations}
          activeConversation={activeConversation}
          ownerData={ownerData}
          onSendMessage={handleSendMessage}
          onClearChat={handleClearChat}
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteMessage}
        />
        <VisitorMessages
          visitorData={ownerData}
          messages={visitorMessages}
          onSendMessage={handleSendMessage}
          onClearChat={handleClearChat}
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteMessage}
        />
      </div>
    </div>
  );
};

export default MainMessages;
