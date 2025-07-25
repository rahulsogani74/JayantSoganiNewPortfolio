import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faEdit,
  faEye,
  faEyeSlash,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/AdsDashboard.css";
import {
  fetchAds,
  addAd,
  updateAd,
  deleteAd,
  toggleSeenAd,
  reorderAdsBatch,
} from "../../Api/api"; // Import the API functions

const AdsDashboard = () => {
  const [ads, setAds] = useState([]);
  const [newAd, setNewAd] = useState({
    image: "",
    description: "",
    link: "",
    seen: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null); // Ref for modal content

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        let imageBase64 = reader.result;

        // Check if the Base64 string already has the prefix
        const prefix = "data:image";

        // Remove the prefix if it exists
        if (imageBase64.startsWith(prefix)) {
          imageBase64 = imageBase64.split(",")[1]; // Remove the existing prefix part
        }

        // Now, add the correct prefix based on the file's MIME type
        const mimeType = file.type; // image/png or image/jpeg
        imageBase64 = `data:${mimeType};base64,${imageBase64}`;

        // Update the state with the cleaned Base64 string
        setNewAd({ ...newAd, image: imageBase64 });
      };
      reader.readAsDataURL(file); // Convert the file to Base64
    }
  };

  // Fetch ads from backend
  useEffect(() => {
    const loadAds = async () => {
      const fetchedAds = await fetchAds();
      setAds(fetchedAds);
    };

    loadAds();
  }, []);

  // Close modal if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  // Handle add ad
  const handleAddAd = async () => {
    const result = await addAd(newAd);
    if (result) {
      setAds((prevAds) => [newAd, ...prevAds]);
      setNewAd({ image: "", description: "", link: "", seen: false });
      setIsEditing(false);
      setIsModalOpen(false);
    }
  };

  const handleEditAd = (index) => {
    setIsEditing(true);
    setEditingIndex(index);
    setNewAd(ads[index]);
    setIsModalOpen(true);
  };

  const handleUpdateAd = async () => {
    const updatedAd = { ...newAd };
    delete updatedAd._id;

    const result = await updateAd(ads[editingIndex]._id, updatedAd);
    if (result) {
      setAds((prevAds) => {
        const updatedAds = [...prevAds];
        updatedAds[editingIndex] = { ...ads[editingIndex], ...newAd };
        return updatedAds;
      });
      setNewAd({ image: "", description: "", link: "", seen: false });
      setIsEditing(false);
      setIsModalOpen(false);
    }
  };

  // Handle delete ad
  const handleDeleteAd = async (id) => {
    await deleteAd(id);
    setAds(ads.filter((ad) => ad._id !== id));
  };

  // Toggle seen status of an ad
  const toggleSeen = async (ad) => {
    const updatedAd = { ...ad, seen: !ad.seen };
    await toggleSeenAd(ad._id, updatedAd);
    setAds(ads.map((a) => (a._id === ad._id ? updatedAd : a)));
  };

  let updateTimeout;

  const moveAd = async (fromIndex, toIndex) => {
    try {
      // Make a copy of the current ads to avoid direct mutation
      const updatedAds = [...ads];
      const currentAd = updatedAds[fromIndex];
      const targetAd = updatedAds[toIndex];

      // Debug: Check the values of currentAd and targetAd before updating
      console.log("currentAd before update:", currentAd);
      console.log("targetAd before update:", targetAd);

      // Store the original order values before the swap
      const currentOrder = currentAd.order;
      const targetOrder = targetAd.order;

      // Swap the order values
      updatedAds[fromIndex].order = targetOrder;
      updatedAds[toIndex].order = currentOrder;
      // Sort updatedAds by order in descending order
      updatedAds.sort((a, b) => b.order - a.order); // Ensure descending order

      // Debug: Check the state after sorting
      console.log("updatedAds after order change and sorting:", updatedAds);

      // Update the local state with the new order immediately
      setAds(updatedAds);

      // Debug: Check the state after updating
      console.log("Updated state with new order:", updatedAds);

      // Clear the previous timeout if it exists
      clearTimeout(updateTimeout);

      // Set a timeout to batch the API request after the user stops interacting
      updateTimeout = setTimeout(async () => {
        // Debug: Check which ads are about to be sent to the API
        const adsToUpdate = updatedAds.map((ad) => ({
          id: ad._id,
          newOrder: ad.order,
        }));

        console.log("adsToUpdate:", adsToUpdate);

        // Call the API to reorder all ads at once
        await reorderAdsBatch(adsToUpdate);
      }, 1000); // Adjust the debounce time as needed
    } catch (error) {
      console.error("Error moving ad:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  console.log(ads);

  return (
    <div className="ads-dashboard">
      <div className="adsads-list">
        <table className="adsads-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Description</th>
              <th>Link</th>
              <th>Seen</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.length > 0 ? (
              ads.map((ad, index) => (
                <tr key={ad._id || ad.id || index}>
                  <td className="adsImage">
                    <img
                      src={
                        ad.image && ad.image.startsWith("data:image")
                          ? ad.image // Use the Base64 string as it is if valid
                          : `data:image/jpeg;base64,${ad.image || ""}` // Default to empty string if `ad.image` is not defined
                      }
                      alt="Ad"
                      className="adsad-image"
                    />
                  </td>

                  <td className="adsdescription">{ad.description}</td>
                  <td className="adslink">
                    <a href={ad.link} className="adsad-link">
                      {ad.link}
                    </a>
                  </td>
                  <td>
                    <button
                      className={`adstoggle2-seen ${
                        ad.seen ? "seen" : "unseen"
                      }`}
                      onClick={() => toggleSeen(ad)}
                    >
                      <FontAwesomeIcon icon={ad.seen ? faEye : faEyeSlash} />
                    </button>
                  </td>
                  <td className="adsaction-buttons">
                    <button
                      className="adsedit-button"
                      onClick={() => handleEditAd(index)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="adsdelete-button"
                      onClick={() => handleDeleteAd(ad._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    {index > 0 && (
                      <button
                        className="adsmove-up"
                        onClick={() => moveAd(index, index - 1)}
                      >
                        <FontAwesomeIcon icon={faArrowUp} />
                      </button>
                    )}
                    {index < ads.length - 1 && (
                      <button
                        className="adsmove-down"
                        onClick={() => moveAd(index, index + 1)}
                      >
                        <FontAwesomeIcon icon={faArrowDown} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-ads-message">
                  No ads available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isModalOpen && (
        <button
          className="adsadd-button"
          onClick={() => {
            setNewAd({ image: "", description: "", link: "", seen: false });
            setIsModalOpen(true);
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Ad
        </button>
      )}

      {isModalOpen && (
        <div className="adsmodal-overlay">
          <div className="adsmodal-content" ref={modalRef}>
            <button className="adsclose-button" onClick={closeModal}>
              &times;
            </button>
            <h2 className="adsmodal-title">
              {isEditing ? "Edit Ad" : "Add New Ad"}
            </h2>
            <input
              type="file"
              className="adsinput-file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {newAd.image && (
              <img
                src={
                  newAd.image.startsWith("data:image")
                    ? newAd.image
                    : `data:image/jpeg;base64,${newAd.image}`
                }
                alt="Image Preview"
                className="adsimage-preview"
              />
            )}

            <textarea
              className="adsinput-textarea"
              placeholder="Description"
              value={newAd.description}
              onChange={(e) =>
                setNewAd({ ...newAd, description: e.target.value })
              }
            />
            <input
              type="text"
              className="adsinput-text"
              placeholder="Link"
              value={newAd.link}
              onChange={(e) => setNewAd({ ...newAd, link: e.target.value })}
            />
            <div className="adsform-actions">
              <button
                className={`adstoggle-seen ${newAd.seen ? "seen" : "unseen"}`}
                onClick={() => setNewAd({ ...newAd, seen: !newAd.seen })}
              >
                {newAd.seen ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
                {newAd.seen ? " Seen" : " Unseen"}
              </button>
              {isEditing ? (
                <button className="adsform-button" onClick={handleUpdateAd}>
                  <FontAwesomeIcon icon={faEdit} /> Update
                </button>
              ) : (
                <button className="adsform-button" onClick={handleAddAd}>
                  <FontAwesomeIcon icon={faPlus} /> Add
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdsDashboard;
