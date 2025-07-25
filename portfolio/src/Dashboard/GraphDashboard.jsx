import React from "react";
import DailyVisitors from "./Graphs/DailyVisitors";
import MonthlyVisitors from "./Graphs/MonthlyVisitors";
import LocationAnalytics from "./Graphs/LocationAnalytics";
import DeviceAnalytics from "./Graphs/DeviceAnalytics";
import PageVisitAnalytics from "./Graphs/PageVisitAnalytics";
import "./styles/Dashboard.css";
import SessionDuration from "./Graphs/SessionDuration";

const Dashboard = () => {
  return (
    <div className="dashboard-content">
      <div className="dashboard-section">
        <DailyVisitors />
        <MonthlyVisitors />
      </div>
      <div className="dashboard-section">
        <LocationAnalytics />
        <DeviceAnalytics />
      </div>
      <div className="dashboard-section">
        <SessionDuration />
        <PageVisitAnalytics />
      </div>
    </div>
  );
};

export default Dashboard;
