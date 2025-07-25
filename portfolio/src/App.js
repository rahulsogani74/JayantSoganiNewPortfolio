import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainHomePage from "./HomePage/MainHomePage";
import Navbar from "./NavBar/Navbar";
import MainInnerPortfolio from "./InnerPortfolio/MainInnerPortfolio";
import MainMessages from "./Messaging/MainMessages";
import Notifications from "./Notifications/Notifications";
import ScrollToTopButton from "./OtherComponent/ScrollToTopButton";
import Settings from "./Settings/Settings";
import MainDashboard from "./Dashboard/MainDeshboard";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainHomePage />} />
        <Route path="/portfolio" element={<MainInnerPortfolio />} />
        <Route path="/messages" element={<MainMessages />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/dashboard/*" element={<MainDashboard />} />
      </Routes>
      <ScrollToTopButton />
    </BrowserRouter>
  );
};

export default App;
