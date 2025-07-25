import React from "react";
import DailyVisitors from "./DailyVisitors";
import MonthlyVisitors from "./MonthlyVisitors";
import LocationAnalytics from "./LocationAnalytics";
import DeviceAnalytics from "./DeviceAnalytics";
import PageVisitAnalytics from "./PageVisitAnalytics";
import "./styles/Dashboard.css";
import SessionDuration from "./SessionDuration";

const Dashboard = () => {
  return (
    <div className="dashboard-content">
      <div className="dashboard-section">
        <DailyVisitors />
        <MonthlyVisitors />
        <SessionDuration />
      </div>
      <div className="dashboard-section">
        <LocationAnalytics />
        <DeviceAnalytics />
        <PageVisitAnalytics />
      </div>
    </div>
  );
};

export default Dashboard;
