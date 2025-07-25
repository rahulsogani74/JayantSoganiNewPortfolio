import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "../styles/PageVisitAnalytics.css";

const PageVisitAnalytics = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [dataPerPage, setDataPerPage] = useState(4); // Default to 4 for larger screens
  const [isMobileView, setIsMobileView] = useState(false); // Track mobile view

  const pageVisits = [
    { page: "Home", visits: 300, uniqueVisitors: 250, bounceRate: 0.5 },
    { page: "About Us", visits: 150, uniqueVisitors: 120, bounceRate: 0.3 },
    { page: "Contact", visits: 100, uniqueVisitors: 80, bounceRate: 0.4 },
    { page: "Products", visits: 250, uniqueVisitors: 200, bounceRate: 0.35 },
    {
      page: "Blog Articles",
      visits: 180,
      uniqueVisitors: 150,
      bounceRate: 0.25,
    },
    {
      page: "Frequently Asked Questions",
      visits: 120,
      uniqueVisitors: 90,
      bounceRate: 0.45,
    },
    {
      page: "Our Services",
      visits: 220,
      uniqueVisitors: 190,
      bounceRate: 0.33,
    },
    {
      page: "Careers Opportunities",
      visits: 90,
      uniqueVisitors: 70,
      bounceRate: 0.5,
    },
    {
      page: "Customer Testimonials",
      visits: 110,
      uniqueVisitors: 90,
      bounceRate: 0.3,
    },
    {
      page: "Pricing Plans",
      visits: 140,
      uniqueVisitors: 120,
      bounceRate: 0.2,
    },
    {
      page: "Portfolio Showcase",
      visits: 160,
      uniqueVisitors: 130,
      bounceRate: 0.35,
    },
    { page: "Case Studies", visits: 130, uniqueVisitors: 100, bounceRate: 0.4 },
    // Add more pages if needed
  ];

  const totalPages = Math.ceil(pageVisits.length / dataPerPage);

  const paginatedData = pageVisits.slice(
    currentPage * dataPerPage,
    currentPage * dataPerPage + dataPerPage
  );

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setDataPerPage(2); // Show fewer pages per view for mobile devices
      setIsMobileView(true); // Set mobile view true
    } else {
      setDataPerPage(4); // Show more pages per view for larger screens
      setIsMobileView(false); // Set mobile view false
    }
  };

  useEffect(() => {
    handleResize(); // Set initial value based on screen size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const totalVisits = pageVisits.reduce((acc, curr) => acc + curr.visits, 0);

  // Function to shorten page names intelligently
  const shortenPageName = (name) => {
    const abbreviations = {
      "Frequently Asked Questions": "FAQs",
      "Customer Testimonials": "Testimonials",
      "About Us": "About",
      "Careers Opportunities": "Careers",
      "Blog Articles": "Blog",
      "Portfolio Showcase": "Portfolio",
      // Add more abbreviations as needed
    };

    // Check if there's an abbreviation for the name
    if (abbreviations[name]) {
      return abbreviations[name];
    }

    // For longer names that don't have an abbreviation
    if (name.length > 10) {
      return name.substring(0, 10) + "..."; // Truncate and add ellipsis
    }

    return name; // Return original name if it's short enough
  };

  // Function to determine which buttons to show
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 3;
    const currentRangeStart = Math.max(0, currentPage - 1);
    const currentRangeEnd = Math.min(totalPages - 1, currentPage + 1);

    if (totalPages <= maxButtons) {
      for (let i = 0; i < totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageClick(i)}
            className={`page-number ${currentPage === i ? "active" : ""}`}
          >
            {i + 1}
          </button>
        );
      }
    } else {
      if (currentPage <= 1) {
        for (let i = 0; i < maxButtons; i++) {
          buttons.push(
            <button
              key={i}
              onClick={() => handlePageClick(i)}
              className={`page-number ${currentPage === i ? "active" : ""}`}
            >
              {i + 1}
            </button>
          );
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - maxButtons; i < totalPages; i++) {
          buttons.push(
            <button
              key={i}
              onClick={() => handlePageClick(i)}
              className={`page-number ${currentPage === i ? "active" : ""}`}
            >
              {i + 1}
            </button>
          );
        }
      } else {
        for (let i = currentRangeStart; i <= currentRangeEnd; i++) {
          buttons.push(
            <button
              key={i}
              onClick={() => handlePageClick(i)}
              className={`page-number ${currentPage === i ? "active" : ""}`}
            >
              {i + 1}
            </button>
          );
        }
      }
    }

    return buttons;
  };

  return (
    <div className="page-visit-analytics">
      <h2 className="heading-primary">Page Visit Analytics</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={paginatedData}>
          <CartesianGrid strokeDasharray="3" />
          <XAxis
            dataKey="page"
            tickFormatter={(page) => shortenPageName(page)} // Shorten page names here
            angle={isMobileView ? -30 : 0} // Rotate only for mobile view
            textAnchor="middle"
          />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(value) => `${value * 100}%`}
          />
          <Tooltip
            formatter={(value, name) =>
              name === "bounceRate" ? `${(value * 100).toFixed(2)}%` : value
            }
          />
          <Bar yAxisId="left" dataKey="visits" fill="#82ca9d" name="Visits" />
          <Bar
            yAxisId="left"
            dataKey="uniqueVisitors"
            fill="#8884d8"
            name="Unique Visitors"
          />
          <Bar
            yAxisId="right"
            dataKey="bounceRate"
            fill="#ffc658"
            name="Bounce Rate"
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Pagination Controls */}
      <div className="pagination-controls">{renderPaginationButtons()}</div>

      <p className="text-large">
        Total visits across all pages : {totalVisits}
      </p>
    </div>
  );
};

export default PageVisitAnalytics;
