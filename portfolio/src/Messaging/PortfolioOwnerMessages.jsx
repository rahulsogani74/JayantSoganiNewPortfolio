import React, { useState, useEffect, useRef } from "react";
import "./Messaging.css";

const PortfolioOwnerMessages = ({
  conversations = [],
  visitors,
  activeConversation,
  onConversationClick,
  onSendMessage,
  onClearChat,
  onEditMessage,
  onDeleteMessage,
}) => {
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const messageEndRef = useRef(null);
  const menuRef = useRef(null);

  const [activeVisitor, setActiveVisitor] = useState(null);

  console.log(
    "ownder ",
    conversations,
    "active",
    activeConversation,
    "on c",
    onConversationClick
  );

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    messageIdx: null,
  });

  const currentMessages = conversations[activeConversation]?.messages || [];

  console.log("currentMessages", currentMessages);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const convo = activeVisitor;

    try {
      console.log("Sending message:", {
        message,
        conversationId: convo?.id,
        name: convo?.name,
      });

      await onSendMessage(message, convo?.id, convo?.name);

      setMessage("");
      setEditingIndex(null);
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  useEffect(() => {
    if (activeConversation !== null) {
      console.log("Active visitor data:", conversations[activeConversation]);
    }
  }, [activeConversation]);

  const handleEditSubmit = () => {
    const messages = conversations[activeConversation]?.messages;
    const msgToEdit = messages?.[editingIndex];

    if (!msgToEdit || message.trim() === msgToEdit.text) {
      setEditingIndex(null);
      setMessage("");
      return;
    }

    onEditMessage(editingIndex, message.trim());
    setEditingIndex(null);
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      editingIndex !== null ? handleEditSubmit() : handleSendMessage();
    }
  };

  const handleEditMessageClick = (index) => {
    const msg = currentMessages[index];
    if (!msg) return;

    setEditingIndex(index);
    setMessage(msg.text);
    setContextMenu({ visible: false, x: 0, y: 0, messageIdx: null });
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations, activeConversation]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleClickAnywhere = () =>
      setContextMenu({ visible: false, x: 0, y: 0, messageIdx: null });

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("click", handleClickAnywhere);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("click", handleClickAnywhere);
    };
  }, []);

  const handleTyping = () => {
    setTypingIndicator(true);
    setTimeout(() => setTypingIndicator(false), 2000);
  };

  return (
    <div className="portfolio-owner-messages">
      <div
        className="conversation-list"
        role="navigation"
        aria-label="Conversations"
      >
        {visitors.map((conv, index) => (
          <div
            key={index}
            role="button"
            tabIndex={0}
            onClick={() => {
              const visitor = visitors[index];
              onConversationClick(index, visitor.id, visitor.name);
              setActiveVisitor(visitor); // ✅ Store clicked visitor
              console.log("Clicked visitor:", visitor); // 👀 Debug log
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                const visitor = visitors[index];
                onConversationClick(index, visitor.id, visitor.name);
                setActiveVisitor(visitor);
                console.log("Keyboard select visitor:", visitor);
              }
            }}
            className={`conversation-item ${
              activeConversation === index ? "active" : ""
            }`}
            aria-pressed={activeConversation === index}
          >
            <img
              src={conv.profilePic || "/default-avatar.png"}
              alt={`${conv.name}'s profile`}
              className="Msgprofile-pic"
            />
            <div className="conversation-info">
              <div className="InlineSpace">
                <h4 className="conversation-name">{conv.name}</h4>
                <span className="last message-time">{conv.time}</span>
              </div>
              <div className="inline">
                <span className={`status ${conv.seen ? "seen" : "unseen"}`}>
                  {conv.seen && (
                    <i className="fa-solid fa-eye symbol seen-symbol"></i>
                  )}
                </span>
                <p className="last-message">
                  {conv.lastMessage || "No messages yet"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="message-thread">
        {activeVisitor !== null && activeVisitor ? (
          <>
            <div className="message-header-row">
              <h2 className="messageHeader">{activeVisitor.name}</h2>

              <div className="chatMenu-wrapper" ref={menuRef}>
                <button
                  className="chatThree-dots"
                  onClick={() => setMenuOpen((prev) => !prev)}
                >
                  &#8942;
                </button>
                {menuOpen && (
                  <div className="chatDropdown-menu">
                    <button onClick={onClearChat}>Clear Chat</button>
                  </div>
                )}
              </div>
            </div>

            <div className="messages" aria-live="polite">
              {currentMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${
                    msg.sender?.id?.toString() === activeVisitor?.id?.toString()
                      ? "sent"
                      : "received"
                  }`}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({
                      visible: true,
                      x: e.pageX,
                      y: e.pageY,
                      messageIdx: idx,
                    });
                  }}
                >
                  <p>{msg.message || msg.text}</p>
                  <div className="flexRow">
                    <span className="message-time">{msg.time}</span>
                    {msg.sender?.id === activeVisitor.id && (
                      <div className="delivery-status">
                        {msg.seen ? (
                          <i className="fa-solid fa-eye symbol seen-symbol"></i>
                        ) : msg.delivered ? (
                          <i className="fas fa-check symbol delivered-symbol"></i>
                        ) : (
                          <i className="fas fa-times symbol not-delivered-symbol"></i>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {typingIndicator && (
                <div className="typing-indicator">Typing...</div>
              )}
              <div ref={messageEndRef} />
            </div>

            <div className="message-input-container">
              <input
                type="text"
                className="message-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={handleTyping}
                placeholder="Type a message..."
              />
              <button
                className="send-button"
                onClick={() =>
                  editingIndex !== null
                    ? handleEditSubmit()
                    : handleSendMessage()
                }
                disabled={!message.trim()}
              >
                {editingIndex !== null ? "Update" : "Send"}
              </button>
            </div>
          </>
        ) : (
          <div className="no-selection-message">
            Please select a sender to view messages.
          </div>
        )}
      </div>

      {contextMenu.visible && (
        <div
          className="custom-context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={() => handleEditMessageClick(contextMenu.messageIdx)}
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => {
              onDeleteMessage(contextMenu.messageIdx);
              setContextMenu({ visible: false, x: 0, y: 0, messageIdx: null });
            }}
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PortfolioOwnerMessages;
