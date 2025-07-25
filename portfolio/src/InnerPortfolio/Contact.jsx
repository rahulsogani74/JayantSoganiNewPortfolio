import React, { useEffect, useState } from "react";

const Contact = ({ contactInfo, isEditing, setUserData }) => {
  const [contacts, setContacts] = useState(contactInfo || []);
  const [newContactType, setNewContactType] = useState("");
  const [newContactValue, setNewContactValue] = useState("");

  useEffect(() => {
    setContacts(contactInfo); // Ensure the contacts are updated if the data changes
  }, [contactInfo]);

  const handleAddContact = () => {
    if (newContactType && newContactValue) {
      const updatedContacts = [
        ...contacts,
        { type: newContactType, value: newContactValue },
      ];
      setContacts(updatedContacts);
      setNewContactType("");
      setNewContactValue("");
      setUserData((prevData) => ({
        ...prevData,
        contacts: updatedContacts, // Update the user data with the new contacts
      }));
    }
  };

  const handleDeleteContact = (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
    setUserData((prevData) => ({
      ...prevData,
      contacts: updatedContacts, // Update the user data with the updated contacts
    }));
  };

  return (
    <section className="contact section">
      <h2>Contact Information</h2>
      {isEditing ? (
        <>
          <div className="contact-inputs">
            <input
              type="text"
              placeholder="Contact Type (e.g., Email, Phone)"
              value={newContactType}
              onChange={(e) => setNewContactType(e.target.value)}
            />
            <input
              type="text"
              placeholder="Contact Value"
              value={newContactValue}
              onChange={(e) => setNewContactValue(e.target.value)}
            />
            <button onClick={handleAddContact}>
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <ul className="contact-list">
            {contacts.map((contact, index) => (
              <li key={index}>
                <button onClick={() => handleDeleteContact(index)}>
                  <i className="fas fa-xmark"></i>
                </button>
                {contact.type}: {contact.value}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <ul className="contact-list">
          {contacts.map((contact, index) => (
            <li key={index}>
              {contact.type}: {contact.value}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Contact;
