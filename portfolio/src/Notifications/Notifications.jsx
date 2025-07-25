import React, { useState } from "react";
import "./Notifications.css";

const notificationsData = [
  {
    id: 1,
    message:
      "You have a new message from John. You have a new message from John. You have a new message from John.You have a new message from John. You have a new message from John.You have a new message from John. You have a new message from John.",
    time: "5 mins ago",
    seen: false,
  },
  {
    id: 2,
    message: "Your report is ready to download.",
    time: "1 hour ago",
    seen: false,
  },
  {
    id: 3,
    message: "Meeting scheduled at 3 PM.",
    time: "2 hours ago",
    seen: true,
  },
  {
    id: 4,
    message: "Password changed successfully.",
    time: "Yesterday",
    seen: true,
  },
  {
    id: 5,
    message: "New comment on your post.",
    time: "10 mins ago",
    seen: false,
  },
  {
    id: 6,
    message: "You have 3 new friend requests.",
    time: "15 mins ago",
    seen: false,
  },
  {
    id: 7,
    message: "System update available.",
    time: "2 days ago",
    seen: true,
  },
  {
    id: 8,
    message: "Your order has been shipped.",
    time: "4 hours ago",
    seen: false,
  },
  {
    id: 9,
    message: "Reminder: Team meeting at 10 AM.",
    time: "30 mins ago",
    seen: false,
  },
  {
    id: 10,
    message: "New feature added to your account.",
    time: "3 days ago",
    seen: true,
  },
  {
    id: 11,
    message: "Invoice #1234 is now overdue.",
    time: "Yesterday",
    seen: true,
  },
  {
    id: 12,
    message: "Your subscription will expire soon.",
    time: "6 hours ago",
    seen: false,
  },
  {
    id: 13,
    message: "A new blog post is available to read.",
    time: "1 day ago",
    seen: true,
  },
  {
    id: 14,
    message: "Your profile has been updated.",
    time: "5 days ago",
    seen: true,
  },
  {
    id: 15,
    message: "You received a new connection request.",
    time: "20 mins ago",
    seen: false,
  },
  {
    id: 16,
    message: "New version of the app is available.",
    time: "Yesterday",
    seen: true,
  },
  {
    id: 17,
    message: "Your trial period is ending soon.",
    time: "2 hours ago",
    seen: false,
  },
  {
    id: 18,
    message: "Payment for Invoice #5678 has been received.",
    time: "2 days ago",
    seen: true,
  },
  {
    id: 19,
    message: "You have been tagged in a photo.",
    time: "12 hours ago",
    seen: false,
  },
  {
    id: 20,
    message: "Your password will expire in 3 days.",
    time: "Yesterday",
    seen: true,
  },
];

function NotificationItem({ notification, onClick }) {
  return (
    <div
      className={`notification-item ${notification.seen ? "seen" : "unseen"}`}
      onClick={() => onClick(notification.id)}
    >
      <p className="notification-message">{notification.message}</p>
      <p className="notification-time">{notification.time}</p>
    </div>
  );
}

const Notifications = () => {
  const [notifications, setNotifications] = useState(notificationsData);

  const markAsSeen = (id) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, seen: true } : notification
    );
    setNotifications(updatedNotifications);
  };

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications available</p>
      ) : (
        <div className="notification-list">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={markAsSeen}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
