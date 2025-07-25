import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faUsers,
  faChartLine,
  faMapMarkerAlt,
  faDesktop,
  faFileAlt,
  faSignInAlt,
  faSignOutAlt,
  faBars,
  faAd,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/Sidebar.css";

const Sidebar = ({ username, userImage }) => {
  const [isOpen, setIsOpen] = useState(false); // State to track sidebar visibility

  const sidebarRef = useRef(null); // Ref to track sidebar element

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev); // Toggle the sidebar visibility
  };

  const closeSidebar = () => {
    setIsOpen(false); // Close the sidebar
  };

  // Close sidebar on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Define sidebar links in an array for mapping
  const navLinks = [
    {
      to: "/dashboard",
      icon: faTachometerAlt,
      label: "Dashboard",
      exact: true,
    },
    { to: "/dashboard/graph", icon: faChartLine, label: "Graph Dashboard" },
    { to: "/dashboard/ads", icon: faAd, label: "Ads Management" },

    {
      to: "/location-analytics",
      icon: faMapMarkerAlt,
      label: "Location Analytics",
    },
    { to: "/device-analytics", icon: faDesktop, label: "Device Analytics" },
    {
      to: "/page-visit-analytics",
      icon: faFileAlt,
      label: "Page Visit Analytics",
    },
  ];

  return (
    <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : ""}`}>
      <button
        className="hamburger"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        <FontAwesomeIcon icon={faBars} /> {/* Hamburger icon */}
      </button>
      <div className="user-info">
        <img src={userImage} alt="User Icon" className="user-icon" />
        {isOpen && <span className="username">Hey, {username}</span>}
      </div>
      <nav className="nav-links">
        {navLinks.map(({ to, icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact} // Use the 'end' prop for exact matching
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
            onClick={closeSidebar}
          >
            <FontAwesomeIcon icon={icon} />
            {isOpen && <span className="side-menus">{label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="auth-links">
        <NavLink
          to="/login"
          className="auth-link"
          className={({ isActive }) =>
            isActive ? "auth-link active-link" : "auth-link"
          }
          onClick={closeSidebar}
        >
          <FontAwesomeIcon className="green" icon={faSignInAlt} />
          {isOpen && <span className="side-menus">Login</span>}
        </NavLink>
        <NavLink
          to="/logout"
          className="auth-link"
          className={({ isActive }) =>
            isActive ? "auth-link active-link" : "auth-link"
          }
          onClick={closeSidebar}
        >
          <FontAwesomeIcon className="red" icon={faSignOutAlt} />
          {isOpen && <span className="side-menus">Logout</span>}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
