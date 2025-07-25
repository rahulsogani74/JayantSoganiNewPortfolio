import React, { useEffect, useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

const Education = ({ education, isEditing, setUserData }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1169);
  const [educationList, setEducationList] = useState(education || []);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1169);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  
  useEffect(() => {
    // Sync experience list with user data whenever it changes.
    if (education.length !== educationList.length) {
      setEducationList(education);
    }
  }, [education]);

  const handleEditChange = (index, field, value) => {
    const updatedList = [...educationList];
    updatedList[index] = { ...updatedList[index], [field]: value };
    setEducationList(updatedList);
    setUserData((prevState) => ({
      ...prevState,
      education: updatedList,
    }));
  };

  const handleAddEducation = () => {
    const updatedList = [
      ...educationList,
      { year: "", degree: "", institution: "", description: "" },
    ];
    setEducationList(updatedList);
    setUserData((prevState) => ({
      ...prevState,
      education: updatedList,
    }));
  };

  const handleDeleteEducation = (index) => {
    const updatedList = educationList.filter((_, i) => i !== index);
    setEducationList(updatedList);
    setUserData((prevState) => ({
      ...prevState,
      education: updatedList,
    }));
  };

  return (
    <section className="education-section">
      <h2 className="section-title">Education</h2>
      <VerticalTimeline>
        {educationList.map((edu, index) => (
          <VerticalTimelineElement
            key={index}
            date={
              isEditing ? (
                <input
                  type="text"
                  placeholder="Year"
                  value={edu.year}
                  onChange={(e) =>
                    handleEditChange(index, "year", e.target.value)
                  }
                />
              ) : (
                edu.year
              )
            }
            iconStyle={{
              background: "#ffbb33",
              color: "#fff",
              padding: isMobile ? "10px" : "20px",
            }}
            icon={<i className="fas fa-graduation-cap"></i>}
            contentStyle={{ background: "#ffbb33" }}
            contentArrowStyle={{ borderRight: "7px solid #ffbb33" }}
          >
            {isEditing ? (
              <>
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) =>
                    handleEditChange(index, "degree", e.target.value)
                  }
                  className="vertical-timeline-element-title"
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) =>
                    handleEditChange(index, "institution", e.target.value)
                  }
                  className="timeline-subtitle"
                />
                <textarea
                  placeholder="Description"
                  value={edu.description}
                  onChange={(e) =>
                    handleEditChange(index, "description", e.target.value)
                  }
                  className="vertical-timeline-element-description"
                />
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteEducation(index)}
                >
                  <i className="fas fa-xmark"></i>
                </button>
              </>
            ) : (
              <>
                <h3 className="vertical-timeline-element-title">
                  {edu.degree}
                </h3>
                <h4 className="timeline-subtitle">{edu.institution}</h4>
                <p className="vertical-timeline-element-description">
                  {edu.description}
                </p>
              </>
            )}
          </VerticalTimelineElement>
        ))}
        {isEditing && (
          <VerticalTimelineElement
            iconStyle={{
              background: "#ffbb33",
              color: "#fff",
              padding: isMobile ? "10px" : "20px",
            }}
            icon={<i className="fas fa-graduation-cap"></i>}
            contentStyle={{ background: "#ffbb33" }}
            contentArrowStyle={{ borderRight: "7px solid #ffbb33" }}
          >
            <div className="add-new-education">
              <button className="add-btn" onClick={handleAddEducation}>
                <i className="fas fa-plus"></i> Add New Education
              </button>
            </div>
          </VerticalTimelineElement>
        )}
      </VerticalTimeline>
    </section>
  );
};

export default Education;
