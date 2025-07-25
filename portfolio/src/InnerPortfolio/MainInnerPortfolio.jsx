// src/InnerPortfolio/MainInnerPortfolio.jsx
import React, { useState, useEffect } from "react";
import "./InnerPortfolioCss.css";
import Header from "./Header";
import Contact from "./Contact";
import About from "./About";
import Education from "./Education";
import Experience from "./Experience";
import Projects from "./Projects";
import Skills from "./Skills";
import { fetchUserInfo, saveUserInfo } from "../Api/api";
import Loader from "../Loader/Loader.jsx"; // Import your Loader component

const MainInnerPortfolio = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    photo: "",
    title: "",
    description: "",
    education: [],
    experience: [],
    projects: [],
    skills: [],
    contacts: [],
    social_links: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      const data = await fetchUserInfo();
      setUserData({
        name: data.user_info.name || "",
        photo: data.user_info.photo || "",
        title: data.user_info.title || "",
        description: data.user_info.description || "",
        education: data.education || [],
        experience: data.experience || [],
        projects: data.projects || [],
        skills: data.skills || [],
        social_links: data.social_links || [],
        contacts: data.contacts || [],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Hide the loader once data is fetched
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSubmit = async () => {
    try {
      await saveUserInfo(userData);
      fetchAllData();
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsLoading(false); // Hide the loader once data is fetched
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      handleSubmit();
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="InnerPortfolio">
      {isLoading && <Loader />}

      <div>
        {userData && (
          <>
            <Header
              name={userData.name}
              photo={userData.photo}
              title={userData.title}
              socialLinks={userData.social_links || []}
              isEditing={isEditing}
              setUserData={setUserData}
            />
            <About
              description={userData.description || []}
              isEditing={isEditing}
              setUserData={setUserData}
            />
            <Education
              education={userData.education || []}
              isEditing={isEditing}
              setUserData={setUserData}
            />
            <Experience
              experience={userData.experience || []}
              isEditing={isEditing}
              setUserData={setUserData}
            />
            <Projects
              projects={userData.projects || []}
              isEditing={isEditing}
              setUserData={setUserData}
            />
            <Skills
              skills={userData.skills || []}
              isEditing={isEditing}
              setUserData={setUserData}
            />
            <Contact
              contactInfo={userData.contacts || []}
              isEditing={isEditing}
              setUserData={setUserData}
            />
          </>
        )}
      </div>
      <div className="edit-header">
        <button className="edit-btn" onClick={toggleEdit}>
          <i className={isEditing ? "fas fa-check" : "fas fa-edit"}></i>
        </button>
      </div>
    </div>
  );
};

export default MainInnerPortfolio;
