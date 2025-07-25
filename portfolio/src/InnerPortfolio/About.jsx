// src/components/About.js
import React, { useEffect, useState } from "react";

const About = ({ description, isEditing, setUserData }) => {
  const [editableDescription, setEditableDescription] = useState(description);

  useEffect(() => {
    setEditableDescription(description); // Ensure the description is updated if the data changes
  }, [description]);

  const handleDescriptionChange = (e) => {
    setEditableDescription(e.target.value);
    setUserData((prevData) => ({
      ...prevData,
      description: e.target.value, // Update the user data with the new description
    }));
  };

  return (
    <section className="about-section section">
      <h2>About Me</h2>
      {isEditing ? (
        <textarea
          value={editableDescription}
          onChange={handleDescriptionChange}
          className="about-description-input"
          style={{ whiteSpace: "pre-wrap" }}
        />
      ) : (
        <p className="about-description" style={{ whiteSpace: "pre-wrap" }}>
          {editableDescription}
        </p>
      )}
    </section>
  );
};

export default About;
