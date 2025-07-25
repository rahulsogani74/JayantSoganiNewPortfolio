import React, { useState } from "react";

const PrivacySettings = () => {
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <div className="privacy-settings">
      <h2>Privacy Settings</h2>
      <div>
        <label>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={() => setIsPrivate(!isPrivate)}
          />
          Set Profile to Private
        </label>
      </div>
      <button className="save-button">Save Changes</button>
    </div>
  );
};

export default PrivacySettings;
