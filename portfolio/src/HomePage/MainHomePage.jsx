import React, { useEffect, useState } from "react";
import Ads from "./Ads/Ads";
import MainContent from "./Content/MainContent";
import Portfolio from "./OuterPortfolio/PortfolioPage";
import "../Css/Main.css";
import PostUpload from "./InputField/PostUpload.jsx";
import PostFeed from "./PostFeed/PostFeed.jsx";
import SortBy from "./Sort/SortBy.jsx";
import { fetchBasicInfo, fetchAdsSeen } from "../Api/api"; // Adjust the path as necessary
import Loader from "../Loader/Loader.jsx"; // Import your Loader component

const MainHomePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserInfoAndAds = async () => {
      try {
        const userData = await fetchBasicInfo();
        const adsData = await fetchAdsSeen(); // Fetch ads data from API
        setUserInfo(userData);
        setAds(adsData); // Set ads data
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false); // Hide the loader once data is fetched
      }
    };

    getUserInfoAndAds();
  }, []);

  return (
    <div className="app-layout">
      {isLoading && <Loader />}

      <div className="OuterPortfolio-section">
        <Portfolio userInfo={userInfo} />
      </div>
      <div className="main-content-section">
        <PostUpload />
        <SortBy />
        <PostFeed />
        <MainContent />
      </div>
      <div className="ads-section">
        <Ads ads={ads} />
      </div>
    </div>
  );
};

export default MainHomePage;
