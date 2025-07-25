import React, { useEffect, useState } from "react";

const Projects = ({ projects = [], isEditing, setUserData }) => {
  const [projectList, setProjectList] = useState(projects || []);
  const [previewImages, setPreviewImages] = useState(
    projects.map((project) => project.image) || []
  );

  useEffect(() => {
    if (projects.length !== projectList.length) {
      setProjectList(projects);
    }
  }, [projects]);

  const handleEditChange = (index, field, value) => {
    const updatedProjects = [...projectList];

    // Trim spaces around each technology in the array
    if (field === "technologies") {
      value = value.split(",").map((tech) => tech.trim());
    }

    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setProjectList(updatedProjects);
    setUserData((prevState) => ({
      ...prevState,
      projects: updatedProjects,
    }));
  };

  const handleAddProject = () => {
    const newProject = {
      name: "",
      description: "",
      technologies: [],
      link: "",
      image: "",
    };

    const updatedProjects = [...projectList, newProject];
    setProjectList(updatedProjects);
    setPreviewImages([...previewImages, ""]);
    setUserData((prevState) => ({
      ...prevState,
      projects: updatedProjects,
    }));
  };

  const handleDeleteProject = (index) => {
    const updatedProjects = projectList.filter((_, i) => i !== index);
    setProjectList(updatedProjects);
    setPreviewImages(previewImages.filter((_, i) => i !== index));
    setUserData((prevState) => ({
      ...prevState,
      projects: updatedProjects,
    }));
  };

  const handleImageChange = (index, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedProjects = [...projectList];
      updatedProjects[index].image = reader.result; // base64 string

      const updatedPreviewImages = [...previewImages];
      updatedPreviewImages[index] = reader.result;

      setProjectList(updatedProjects);
      setUserData((prevState) => ({
        ...prevState,
        projects: updatedProjects,
      }));
      setPreviewImages(updatedPreviewImages);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="projects section">
      <h2>Projects</h2>
      <ul className="projects-list">
        {projectList?.map((project, index) => (
          <li key={index} className="project-item">
            {isEditing ? (
              <>
                <input
                  type="text"
                  placeholder="Project Name"
                  value={project?.name}
                  onChange={(e) =>
                    handleEditChange(index, "name", e.target.value)
                  }
                  className="project-input"
                />
                <textarea
                  placeholder="Project Description"
                  value={project?.description}
                  onChange={(e) =>
                    handleEditChange(index, "description", e.target.value)
                  }
                  className="project-textarea"
                />
                <input
                  type="text"
                  placeholder="Technologies (comma-separated)"
                  value={project?.technologies.join(", ")}
                  onChange={(e) =>
                    handleEditChange(index, "technologies", e.target.value)
                  }
                  className="project-input"
                />
                <input
                  type="text"
                  placeholder="Project Link"
                  value={project?.link}
                  onChange={(e) =>
                    handleEditChange(index, "link", e.target.value)
                  }
                  className="project-input"
                />
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteProject(index)}
                >
                  <i className="fas fa-xmark"></i>
                </button>
                <div className="project-image-upload">
                  <img
                    src={previewImages[index] || project?.image}
                    alt={project?.name}
                    className="project-image-preview"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange(index, e.target.files[0])
                    }
                    className="project-input"
                  />
                </div>
              </>
            ) : (
              <>
                <img
                  src={previewImages[index] || project?.image}
                  alt={project?.name}
                  className="project-image"
                />
                <div className="project-details">
                  <strong className="project-name">{project?.name}</strong>
                  <p className="project-description">{project?.description}</p>
                  <p className="project-tech">
                    {project?.technologies.join(", ")}
                  </p>
                  <a
                    href={project?.link}
                    className="project-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                  </a>
                </div>
              </>
            )}
          </li>
        ))}
        {isEditing && (
          <li className="add-new-project">
            <button className="add-btn" onClick={handleAddProject}>
              <i className="fas fa-plus"></i> Add New Project
            </button>
          </li>
        )}
      </ul>
    </section>
  );
};

export default Projects;
