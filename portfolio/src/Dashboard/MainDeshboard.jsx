import React, { useEffect, useState } from "react";
import "./styles/Dashboard.css";
import Sidebar from "./Sidebar/Sidebar";
import Dashboard from "./Dashboard";
import GraphDashboard from "./GraphDashboard";
import DailyVisitors from "./DailyVisitors";
import MonthlyVisitors from "./MonthlyVisitors";
import LocationAnalytics from "./LocationAnalytics";
import DeviceAnalytics from "./DeviceAnalytics";
import PageVisitAnalytics from "./PageVisitAnalytics";
import { Route, Routes } from "react-router-dom";
import MobileSidebar from "./Sidebar/MobileSidebar";
import { fetchBasicInfo } from "../Api/api.js";

import Loader from "../Loader/Loader.jsx"; // Import your Loader component
import AdsDashboard from "./Ads/AdsDashboard.jsx";

const MainDashboard = () => {
  const [userImage, setUserImage] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const data = await fetchBasicInfo();
        if (data) {
          setUserImage(data.photo);
          setUsername(data.name);
        }
      } catch (error) {
        console.error("Failed to fetch user image:", error);
      } finally {
        setIsLoading(false); // Hide the loader once data is fetched
      }
    };

    fetchUserImage();
  }, []);

  return (
    <div className="main-dashboard">
      {isLoading && <Loader />}

      {/* Sidebar for larger screens */}
      <div className="main-sidebar desktop-sidebar">
        <Sidebar userImage={userImage} username={username} />
      </div>

      {/* Mobile sidebar */}
      <div className="main-sidebar mobile-sidebar">
        <MobileSidebar userImage={userImage} />
      </div>

      <div className="dashboard">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/graph" element={<GraphDashboard />} />
          <Route path="/ads" element={<AdsDashboard />} />
          <Route path="/monthly-visitors" element={<MonthlyVisitors />} />
          <Route path="/location-analytics" element={<LocationAnalytics />} />
          <Route path="/device-analytics" element={<DeviceAnalytics />} />
          <Route
            path="/page-visit-analytics"
            element={<PageVisitAnalytics />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default MainDashboard;
