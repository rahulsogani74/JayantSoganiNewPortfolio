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
import "../styles/MobileSidebar.css";

const MobileSidebar = ({ userImage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExtraOpen, setIsExtraOpen] = useState(false);

  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
    setIsExtraOpen(false); // Close extra menu if sidebar is toggled
  };

  const toggleExtraMenu = () => {
    setIsExtraOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsOpen(false);
    setIsExtraOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const visibleLinks = navLinks.slice(0, 3); // Show first 3 items initially
  const extraLinks = navLinks.slice(3); // Rest of the items to show in extra menu

  return (
    <div ref={sidebarRef} className={`mobile-sidebar ${isOpen ? "open" : ""}`}>
      <div className="top-row">
        <img src={userImage} alt="User Icon" className="user-icon" />
        {visibleLinks.map(({ to, icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
            onClick={closeSidebar}
          >
            <FontAwesomeIcon icon={icon} />
            <span className="side-menus">{label}</span>
          </NavLink>
        ))}

        {/* Auth Links */}
        <div className="Mob_auth-links">
          {/* <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "auth-link active-link" : "auth-link"
            }
            onClick={closeSidebar}
          >
            <FontAwesomeIcon className="green" icon={faSignInAlt} />
            <span className="side-menus">Login</span>
          </NavLink> */}

          <NavLink
            to="/logout"
            className={({ isActive }) =>
              isActive ? "auth-link active-link" : "auth-link"
            }
            onClick={closeSidebar}
          >
            <FontAwesomeIcon className="red" icon={faSignOutAlt} />
            <span className="side-menus">Logout</span>
          </NavLink>
        </div>

        {extraLinks.length > 0 && (
          <button
            className="Mob_hamburger"
            onClick={toggleExtraMenu}
            aria-label="Toggle extra menu"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        )}
      </div>

      {isExtraOpen && (
        <div className="extra-row">
          {extraLinks.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? "nav-link active-link" : "nav-link"
              }
              onClick={closeSidebar}
            >
              <FontAwesomeIcon icon={icon} />
              <span className="side-menus">{label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileSidebar;
