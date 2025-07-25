import React, { useState } from "react";
import NotificationSettings from "./NotificationSettings";
import PrivacySettings from "./PrivacySettings";
import "./Settings.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <button onClick={() => setActiveTab("notifications")}>
          Notifications
        </button>
        <button onClick={() => setActiveTab("privacy")}>Privacy</button>
      </div>
      <div className="settings-content">
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "privacy" && <PrivacySettings />}
      </div>
    </div>
  );
};

export default Settings;
