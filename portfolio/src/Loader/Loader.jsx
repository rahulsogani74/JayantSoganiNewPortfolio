import React from "react";
import "./Loader.css"; // Make sure to import the combined CSS

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="loader"></div>
        <span className="loader2">Loading</span>
      </div>
    </div>
  );
};

export default Loader;
