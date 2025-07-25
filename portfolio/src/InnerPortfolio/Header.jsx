import React, { useEffect, useState } from "react";

const Header = ({
  name,
  photo,
  socialLinks,
  title,
  isEditing,
  setUserData,
}) => {
  const [editableName, setEditableName] = useState(name);
  const [editablePhoto, setEditablePhoto] = useState(photo);
  const [editableSocialLinks, setEditableSocialLinks] = useState(socialLinks);
  const [editableTitle, setEditableTitle] = useState(title);

  useEffect(() => {
    setEditableName(name); // Ensure the state is updated when userData changes
    setEditablePhoto(photo);
    setEditableSocialLinks(socialLinks);
    setEditableTitle(title);
  }, [name, photo, title, socialLinks]);

  const handleInputChange = (e) => {
    setEditableName(e.target.value);
    setUserData((prevData) => ({
      ...prevData,
      name: e.target.value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditablePhoto(reader.result);
        setUserData((prevData) => ({
          ...prevData,
          photo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialLinkChange = (index, e) => {
    const newLinks = [...editableSocialLinks];
    newLinks[index].url = e.target.value;
    setEditableSocialLinks(newLinks);
    setUserData((prevData) => ({
      ...prevData,
      social_links: newLinks,
    }));
  };

  const handlePlatformChange = (index, e) => {
    const newLinks = [...editableSocialLinks];
    newLinks[index].platform = e.target.value;
    setEditableSocialLinks(newLinks);
    setUserData((prevData) => ({
      ...prevData,
      social_links: newLinks,
    }));
  };

  const handleAddSocialLink = () => {
    setEditableSocialLinks([...editableSocialLinks, { platform: "", url: "" }]);
  };

  const handleDeleteSocialLink = (index) => {
    const newLinks = editableSocialLinks.filter((_, i) => i !== index);
    setEditableSocialLinks(newLinks);
    setUserData((prevData) => ({
      ...prevData,
      social_links: newLinks,
    }));
  };

  const handleTitleChange = (e) => {
    setEditableTitle(e.target.value);
    setUserData((prevData) => ({
      ...prevData,
      title: e.target.value,
    }));
  };

  return (
    <header>
      {isEditing ? (
        <div className="header">
          <div className="header-photo-edit">
            {editablePhoto && (
              <img
                src={editablePhoto}
                alt="Uploaded Preview"
                className="header-photo-preview"
              />
            )}
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="header-photo-input"
            />
          </div>

          <div className="header-info-edit">
            <input
              type="text"
              id="name"
              value={editableName}
              onChange={handleInputChange}
              className="header-name-input"
            />

            <input
              type="text"
              id="title"
              value={editableTitle}
              onChange={handleTitleChange}
              className="header-title-input"
            />

            <div className="header-social-iconsEdit">
              {editableSocialLinks.map((link, index) => (
                <div key={index} className="inline">
                  <button onClick={() => handleDeleteSocialLink(index)}>
                    <i className="fas fa-xmark"></i>
                  </button>

                  <select
                    value={link.platform}
                    onChange={(e) => handlePlatformChange(index, e)}
                    className="header-social-platform-select"
                  >
                    <option value="">Select Platform</option>
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                    <option value="github">GitHub</option>
                    {/* Add more platforms if needed */}
                  </select>

                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => handleSocialLinkChange(index, e)}
                    className="header-social-link-input"
                  />
                </div>
              ))}
              <button onClick={handleAddSocialLink}>Add Social Link</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="header">
          <img
            src={editablePhoto}
            alt={editableName}
            className="header-photo"
          />
          <div className="header-info">
            <h1>{editableName}</h1>
            <h2>{editableTitle}</h2>
            <div className="header-social-icons">
              {editableSocialLinks.map(
                (link, index) =>
                  link.platform &&
                  link.url && (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className={`fab fa-${link.platform}`}></i>
                    </a>
                  )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
