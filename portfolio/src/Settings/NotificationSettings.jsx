import React, { useState } from "react";

const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  return (
    <div className="notification-settings">
      <h2>Notification Settings</h2>
      <div>
        <label>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
          />
          Email Notifications
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={smsNotifications}
            onChange={() => setSmsNotifications(!smsNotifications)}
          />
          SMS Notifications
        </label>
      </div>
      <button className="save-button">Save Changes</button>
    </div>
  );
};

export default NotificationSettings;
