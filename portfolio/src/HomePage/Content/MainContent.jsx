import React from 'react';
import '../../Css/Main.css';

const MainContent = () => {
  return (
    <div className="main-content">
      <h1>Welcome to My Portfolio</h1>
      <p>
        Hi, I'm a web developer with experience in building scalable and
        responsive websites and applications. My focus is on delivering
        high-quality products that meet the needs of the users while ensuring a
        smooth user experience.
      </p>
      <img
        src="https://via.placeholder.com/600x400"
        alt="Developer at work"
        className="main-image"
      />
      <h2>About My Work</h2>
      <p>
        I specialize in front-end and back-end development, and my recent work
        includes building complex web applications using React, Node.js, and
        MongoDB. I also have experience with cloud services like AWS and Azure.
      </p>
    </div>
  );
};

export default MainContent;
