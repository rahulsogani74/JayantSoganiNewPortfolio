import React from "react";
import "../../Css/Main.css";
import { Link } from "react-router-dom";

const Portfolio = ({ userInfo }) => {
  return (
    <div className="OuterPortfolio">
      <div className="profile">
        <Link to="/portfolio" className="LinkHideLink">
          <img src={userInfo?.photo || ""} alt="User" className="profile-pic" />
          <h2>{userInfo?.name || ""}</h2>{" "}
        </Link>

        <p className="brief-about">{userInfo?.description || ""}</p>
        {/* <p className="location">
          <i className="fas fa-map-marker-alt"></i> San Francisco, CA
        </p> */}
        <p className="company">
          <i className="fas fa-building"></i> Currently at{" "}
          {userInfo?.title || ""}
        </p>
      </div>

      {/* <h2>My Portfolio</h2>

      <div className="OuterPortfolio-item">
        <img src="https://via.placeholder.com/150" alt="Project 1" />
        <h3>Project 1</h3>
        <p>A web development project focused on responsive design.</p>
      </div>
      <div className="OuterPortfolio-item">
        <img src="https://via.placeholder.com/150" alt="Project 2" />
        <h3>Project 2</h3>
        <p>An e-commerce platform built with React and Node.js.</p>
      </div>
      <div className="OuterPortfolio-item">
        <img src="https://via.placeholder.com/150" alt="Project 3" />
        <h3>Project 3</h3>
        <p>A mobile app that helps users track their daily habits.</p>
      </div> */}
    </div>
  );
};

export default Portfolio;
