import React, { useState } from "react";

const NavbarSearch = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State to handle search input

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value); // Update search query on input change
  };

  const handleSearch = () => {
    console.log("Search query:", searchQuery); // Perform search action here
    // You can also trigger a search action or call an API based on `searchQuery`
  };

  return (
    <div className="navbar-search-large">
      <div className="Navsearch-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleInputChange}
          className="Navsearch-input"
        />
        <span className="Navsearch-icon" onClick={handleSearch}>
          <i className="fas fa-search"></i>
        </span>
      </div>
    </div>
  );
};

export default NavbarSearch;
