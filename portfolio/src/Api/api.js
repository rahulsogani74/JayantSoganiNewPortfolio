const BASE_URL = process.env.REACT_APP_LOCALHOST_BASE_URL;

export const fetchBasicInfo = async () => {
  try {
    const response = await fetch(`${BASE_URL}/basic-info`);
    if (!response.ok) {
      throw new Error("Error fetching user info");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const fetchUserInfo = async () => {
  try {
    const response = await fetch(`${BASE_URL}/user-info`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const saveUserInfo = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/user-info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_info: {
          name: userData.name,
          photo: userData.photo,
          title: userData.title,
          description: userData.description,
        },
        education: userData.education,
        experience: userData.experience,
        projects: userData.projects,
        skills: userData.skills.map((skill) =>
          typeof skill === "string" ? { name: skill } : skill
        ),
        social_links: userData.social_links,
        contacts: userData.contacts,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save data");
    }
  } catch (error) {
    console.error("Error saving data:", error);
    throw error;
  }
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
};

const adsApi = {
  // Get all ads
  getAllAds: async () => {
    try {
      const response = await fetch(`${BASE_URL}/ads`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.message || "Failed to fetch ads");
    }
  },

  // Add new ad
  addAd: async (adData) => {
    try {
      const response = await fetch(`${BASE_URL}/ads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adData),
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.message || "Failed to add ad");
    }
  },

  // Update existing ad
  updateAd: async (adId, adData) => {
    try {
      const response = await fetch(`${BASE_URL}/ads/${adId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adData),
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.message || "Failed to update ad");
    }
  },

  // Delete ad
  deleteAd: async (adId) => {
    try {
      const response = await fetch(`${BASE_URL}/ads/${adId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return handleResponse(response);
    } catch (error) {
      throw new Error(error.message || "Failed to delete ad");
    }
  },
};

export default adsApi;

export const fetchAdsSeen = async () => {
  try {
    const response = await fetch(`${BASE_URL}/ads/seen`, {
      // Fixed URL endpoint
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json(); // Parse the response as JSON
    return data;
  } catch (error) {
    console.error("Error fetching ads:", error);
    return []; // Return an empty array in case of error
  }
};

const API_URL = "http://localhost:5000/api/ads";

export const fetchAds = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    if (Array.isArray(data)) {
      return data;
    }
    throw new Error("Failed to fetch ads");
  } catch (error) {
    console.error("Error fetching ads:", error);
    return [];
  }
};

export const addAd = async (newAd) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAd),
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding ad:", error);
    return null;
  }
};

export const updateAd = async (id, updatedAd) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAd),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating ad:", error);
    return null;
  }
};

export const deleteAd = async (id) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting ad:", error);
  }
};

export const toggleSeenAd = async (id, updatedAd) => {
  try {
    await fetch(`${API_URL}/${id}/toggle-seen`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAd),
    });
  } catch (error) {
    console.error("Error toggling seen status:", error);
  }
};

export const reorderAdsBatch = async (adsToUpdate) => {
  try {
    const response = await fetch(`${API_URL}/reorder`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ads: adsToUpdate,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to reorder ads");
    }
    console.log("Ads reordered successfully:", data);
  } catch (error) {
    console.error("Error saving reordered ads:", error);
  }
};
