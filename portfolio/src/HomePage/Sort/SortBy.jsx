import React, { useState } from "react";
import "./SortBy.css"; // Import the CSS

const SortBy = ({ onSortChange }) => {
  const [selectedOption, setSelectedOption] = useState("recent");

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    onSortChange(value);
  };

  return (
    <div className="sort-by-container">
      <span className="sort-by-label"> Sort By: </span>
      <select
        id="sort"
        value={selectedOption}
        onChange={handleSortChange}
        className="sort-by-select"
      >
        <option value="popular">Popular</option>
        <option value="discussed">Discussed</option>
        <option value="recent">Recent</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
};

export default SortBy;
