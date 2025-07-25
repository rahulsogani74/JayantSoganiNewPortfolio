import React, { useEffect, useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

const Experience = ({ experience, isEditing, setUserData }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth >= 1169);
  const [experienceList, setExperienceList] = useState(experience || []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth >= 1169);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Sync experience list with user data whenever it changes.
    if (experience.length !== experienceList.length) {
      setExperienceList(experience);
    }
  }, [experience]);

  const handleEditChange = (index, field, value) => {
    const updatedList = [...experienceList];
    updatedList[index] = { ...updatedList[index], [field]: value };
    setExperienceList(updatedList);
    setUserData((prevState) => ({
      ...prevState,
      experience: updatedList,
    }));
  };

  const handleAddExperience = () => {
    const newExperience = {
      year: "",
      position: "",
      company: "",
      description: "",
    };
    const updatedList = [...experienceList, newExperience];

    setExperienceList(updatedList);
    setUserData((prevState) => ({
      ...prevState,
      experience: updatedList,
    }));
  };

  const handleDeleteExperience = (index) => {
    const updatedList = experienceList.filter((_, i) => i !== index);
    setExperienceList(updatedList);
    setUserData((prevState) => ({
      ...prevState,
      experience: updatedList,
    }));
  };

  return (
    <section className="experience-section">
      <h2 className="section-title">Experience</h2>
      <VerticalTimeline>
        {experienceList.map((job, index) => (
          <VerticalTimelineElement
            key={index}
            date={
              isEditing ? (
                <input
                  type="text"
                  placeholder="Year"
                  value={job.year}
                  onChange={(e) =>
                    handleEditChange(index, "year", e.target.value)
                  }
                  className="timeline-input"
                />
              ) : (
                job.year
              )
            }
            icon={<i className="fas fa-briefcase"></i>}
            iconStyle={{
              background: "#007bff",
              color: "#fff",
              padding: isMobile ? "20px" : "10px",
            }}
            contentStyle={{ background: "#007bff" }}
            contentArrowStyle={{ borderRight: "7px solid #007bff" }}
          >
            {isEditing ? (
              <>
                <input
                  type="text"
                  placeholder="Position"
                  value={job.position}
                  onChange={(e) =>
                    handleEditChange(index, "position", e.target.value)
                  }
                  className="timeline-input"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={job.company}
                  onChange={(e) =>
                    handleEditChange(index, "company", e.target.value)
                  }
                  className="timeline-input"
                />
                <textarea
                  placeholder="Description"
                  value={job.description}
                  onChange={(e) =>
                    handleEditChange(index, "description", e.target.value)
                  }
                  className="timeline-input"
                />
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteExperience(index)}
                >
                  <i className="fas fa-xmark"></i>
                </button>
              </>
            ) : (
              <>
                <h3 className="timeline-title">{job.position}</h3>
                <h4 className="timeline-subtitle">{job.company}</h4>
                <p className="timeline-description">{job.description}</p>
              </>
            )}
          </VerticalTimelineElement>
        ))}
        {isEditing && (
          <VerticalTimelineElement
            icon={<i className="fas fa-briefcase"></i>}
            iconStyle={{
              background: "#007bff",
              color: "#fff",
              padding: isMobile ? "20px" : "10px",
            }}
            contentStyle={{ background: "#007bff" }}
            contentArrowStyle={{ borderRight: "7px solid #e0f7fa" }}
          >
            <div className="add-new-experience">
              <button className="add-btn" onClick={handleAddExperience}>
                <i className="fas fa-plus"></i> Add New Experience
              </button>
            </div>
          </VerticalTimelineElement>
        )}
      </VerticalTimeline>
    </section>
  );
};

export default Experience;
