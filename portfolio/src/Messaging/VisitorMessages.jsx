import React, { useEffect, useRef, useState } from "react";
import "./Messaging.css";

const VisitorMessages = ({
  visitorData,
  messages,
  onSendMessage,
  onScrollToFetchOlderMessages,
  onClearChat, // 👈 Function to clear messages
  onEditMessage, // <-- add this
  onDeleteMessage,
}) => {
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // 👈 for 3 dots menu
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null);
  const menuRef = useRef(null);

  const [editingIndex, setEditingIndex] = useState(null);

  console.log("message visitorData", messages, visitorData);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    messageIdx: null,
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleScroll = () => {
    if (messageListRef.current.scrollTop === 0) {
      onScrollToFetchOlderMessages();
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message, visitorData.id, visitorData.name);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClick = () =>
      setContextMenu({ visible: false, x: 0, y: 0, messageIdx: null });
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleEditSubmit = () => {
    const msgToEdit = messages[editingIndex];
    if (!msgToEdit || message.trim() === msgToEdit.text) {
      setEditingIndex(null);
      setMessage("");
      return;
    }

    onEditMessage(editingIndex, message.trim()); // call prop
    setEditingIndex(null); // reset editing
    setMessage(""); // clear input
  };

  const handleEditMessageClick = (index) => {
    setEditingIndex(index);
    setMessage(messages[index].text); // put old msg in input box
  };

  return (
    <div className="visitor-messages">
      <div className="message-header-row">
        <h2 className="messageHeader">{visitorData?.name}</h2>

        {/* ⋯ Menu */}
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

      <div className="messages" onScroll={handleScroll} ref={messageListRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${
              msg.sender?.id?.toString() === visitorData?.id?.toString()
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
            onTouchStart={(e) => {
              e.currentTarget.longPressTimer = setTimeout(() => {
                const rect = e.currentTarget.getBoundingClientRect();
                setContextMenu({
                  visible: true,
                  x: rect.left + 10,
                  y: rect.top + 30,
                  messageIdx: idx,
                });
              }, 600);
            }}
          >
            <p>{msg.text}</p>
            <div className="flexRow">
              <span className="message-time">{msg.time}</span>
              {msg.sender?.id === visitorData.id && (
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
            <div ref={messagesEndRef} />
          </div>
        ))}
      </div>

      <div className="message-input-container">
        <input
          type="text"
          className="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <button
          className="send-button"
          onClick={() => {
            if (editingIndex !== null) {
              handleEditSubmit(); // submit edited message
            } else {
              handleSendMessage(); // send new message
            }
          }}
          disabled={!message.trim()}
        >
          {editingIndex !== null ? "Update" : "Send"}
        </button>
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
          <button onClick={() => onDeleteMessage(contextMenu.messageIdx)}>
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default VisitorMessages;
