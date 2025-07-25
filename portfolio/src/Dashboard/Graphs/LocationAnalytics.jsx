import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import "../styles/LocationAnalytics.css";

const LocationAnalytics = () => {
  const dataPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);

  const locations = [
    { country: "USA", count: 120 },
    { country: "India", count: 200 },
    { country: "UK", count: 80 },
    { country: "Canada", count: 60 },
    { country: "Germany", count: 150 },
    { country: "Australia", count: 90 },
    { country: "France", count: 70 },
    { country: "Brazil", count: 110 },
    { country: "Italy", count: 130 },
    { country: "Spain", count: 140 },
    { country: "Mexico", count: 95 },
    { country: "Japan", count: 160 },
    { country: "South Korea", count: 75 },
    { country: "Russia", count: 85 },
    { country: "Netherlands", count: 50 },
  ];

  const totalPages = Math.ceil(locations.length / dataPerPage);
  const paginatedData = locations.slice(
    currentPage * dataPerPage,
    currentPage * dataPerPage + dataPerPage
  );

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="location-analytics">
      <h2 className="heading-primary">Visitor Locations</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={paginatedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="country"
              interval={0}
              tick={{ fontSize: 10 }}
              angle={-25} // Rotate labels
              dy={10} // Adjust position to avoid overlap
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8">
              <LabelList dataKey="count" position="mid" fill="#333" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pagination-controls">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index)}
            className={`page-number ${currentPage === index ? "active" : ""}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <p className="text-large">
        Total visitors: {locations.reduce((acc, curr) => acc + curr.count, 0)}
      </p>
    </div>
  );
};

export default LocationAnalytics;
