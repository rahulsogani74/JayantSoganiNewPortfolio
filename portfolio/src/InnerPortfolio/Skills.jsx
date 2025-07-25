import React, { useEffect, useState } from "react";

const Skills = ({ skills, isEditing, setUserData }) => {
  // Extract only names from each skill if skills are objects
  const [skillList, setSkillList] = useState(
    skills.map((skill) => (typeof skill === "object" ? skill.name : skill)) || []
  );
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    // Update skillList whenever skills prop changes
    if (skills.length !== skillList.length) {
      setSkillList(skills.map((skill) => (typeof skill === "object" ? skill.name : skill)));
    }
  }, [skills]);

  const handleAddSkill = () => {
    if (newSkill) {
      const updatedSkills = [...skillList, newSkill];
      setSkillList(updatedSkills);
      setUserData((prevState) => ({
        ...prevState,
        skills: updatedSkills,
      }));
      setNewSkill("");
    }
  };

  const handleDeleteSkill = (index) => {
    const updatedSkills = skillList.filter((_, i) => i !== index);
    setSkillList(updatedSkills);
    setUserData((prevState) => ({
      ...prevState,
      skills: updatedSkills,
    }));
  };

  return (
    <section className="skills section">
      <h2 className="skills-title">Skills</h2>
      {isEditing ? (
        <>
          <div className="skills-input">
            <input
              type="text"
              placeholder="Add a new skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <button onClick={handleAddSkill}>
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <div className="skills-badges">
            {skillList.map((skill, index) => (
              <div key={index} className="skill-badge">
                {skill}
                <button onClick={() => handleDeleteSkill(index)}>
                  <i className="fas fa-xmark"></i>
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="skills-badges">
          {skillList.map((skill, index) => (
            <div key={index} className="skill-badge">
              {skill}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Skills;
