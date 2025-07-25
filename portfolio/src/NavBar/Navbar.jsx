import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faComments,
  faBell,
  faUser,
  faFile,
  faSearch,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import NavbarSearch from "./NavbarSearch";
import { fetchBasicInfo } from "../Api/api";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userImage, setUserImage] = useState("");
  const navbarRef = useRef(null);
  const searchRef = useRef(null);
  const searchIconRef = useRef(null);
  const userIconRef = useRef(null);

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const data = await fetchBasicInfo();
        if (data) {
          setUserImage(data.photo);
        }
      } catch (error) {
        console.error("Failed to fetch user image:", error);
      }
    };

    fetchUserImage();
  }, []);

  const toggleNavbar = () => {
    setIsOpen((prev) => !prev);
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    // Close the navbar if clicked outside
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setIsOpen(false);
    }

    // Close the search if clicked outside and not on the search icon
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target) &&
      !searchIconRef.current.contains(event.target)
    ) {
      setIsSearchOpen(false);
    }

    // Close the dropdown if clicked outside and not on the user icon
    if (userIconRef.current && !userIconRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to handle clicks on navbar items
  const handleNavbarItemClick = () => {
    if (window.innerWidth <= 768) {
      // Close the navbar if in mobile view
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div ref={navbarRef}>
      <div className="MainNav">
        <div className={`navbar ${isOpen ? "active" : ""}`}>
          <div className="navbar-logo">
            <NavLink
              to="/"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span>{isMobile ? "J.S." : "Jayant Sogani"}</span>
            </NavLink>
          </div>

          <NavbarSearch />

          <div className="navbar-toggle" onClick={toggleNavbar}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>

          <div className={`navbar-items ${isOpen ? "show" : ""}`}>
            <NavLink
              to="/"
              className="navbar-item"
              activeClassName="active"
              onClick={handleNavbarItemClick}
            >
              <FontAwesomeIcon icon={faHome} className="navbar-icon" />
              <span>Home</span>
            </NavLink>
            <NavLink
              to="/messages"
              className="navbar-item"
              activeClassName="active"
              onClick={handleNavbarItemClick}
            >
              <FontAwesomeIcon icon={faComments} className="navbar-icon" />
              <span>Messaging</span>
            </NavLink>
            <NavLink
              to="/notifications"
              className="navbar-item"
              activeClassName="active"
              onClick={handleNavbarItemClick}
            >
              <FontAwesomeIcon icon={faBell} className="navbar-icon" />
              <span>Notifications</span>
            </NavLink>
            <NavLink
              to="/portfolio"
              className="navbar-item"
              activeClassName="active"
              onClick={handleNavbarItemClick}
            >
              <FontAwesomeIcon icon={faUser} className="navbar-icon" />
              <span>Profile</span>
            </NavLink>
            <NavLink
              to="/resume"
              className="navbar-item"
              activeClassName="active"
              onClick={handleNavbarItemClick}
            >
              <FontAwesomeIcon icon={faFile} className="navbar-icon" />
              <span>Resume</span>
            </NavLink>
          </div>

          <div
            className="navbar-search-icon"
            ref={searchIconRef}
            onClick={toggleSearch}
          >
            <FontAwesomeIcon icon={faSearch} className="navbar-icon" />
          </div>

          <div
            className="navbar-user-icon"
            ref={userIconRef}
            onClick={toggleDropdown}
          >
            <img src={userImage} alt="User" className="user-icon" />
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`Navdropdown-icon ${isDropdownOpen ? "open" : ""}`}
            />
            {isDropdownOpen && (
              <div className="Navdropdown-menu">
                <NavLink to="/profile" className="Navdropdown-item">
                  Profile
                </NavLink>
                <NavLink to="/dashboard" className="Navdropdown-item">
                  Dashboard
                </NavLink>
                <NavLink to="/settings" className="Navdropdown-item">
                  Settings
                </NavLink>
                <NavLink to="/logout" className="Navdropdown-item">
                  Logout
                </NavLink>
                <NavLink to="/activity" className="Navdropdown-item">
                  Activity
                </NavLink>
                <NavLink to="/help" className="Navdropdown-item">
                  Help
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {isSearchOpen && (
          <div
            ref={searchRef}
            className={`mobile-search ${isSearchOpen ? "show" : ""}`}
          >
            <input type="text" placeholder="Search..." />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
