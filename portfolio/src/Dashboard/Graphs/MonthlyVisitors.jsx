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
import "../styles/MonthlyVisitors.css";

const MonthlyVisitors = () => {
  const dataPerPage = 4; // Number of months to show per page
  const [currentPage, setCurrentPage] = useState(0);

  const monthlyVisitors = [
    { month: "Jan", visitors: 1200 },
    { month: "Feb", visitors: 1500 },
    { month: "Mar", visitors: 1700 },
    { month: "Apr", visitors: 1400 },
    { month: "May", visitors: 1600 },
    { month: "Jun", visitors: 1800 },
    { month: "Jul", visitors: 2000 },
    { month: "Aug", visitors: 2200 },
    { month: "Sep", visitors: 2100 },
    { month: "Oct", visitors: 2300 },
    { month: "Nov", visitors: 2500 },
    { month: "Dec", visitors: 2400 },
  ];

  const totalPages = Math.ceil(monthlyVisitors.length / dataPerPage);

  // Data for the current page
  const paginatedData = monthlyVisitors.slice(
    currentPage * dataPerPage,
    currentPage * dataPerPage + dataPerPage
  );

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const totalVisitors = monthlyVisitors.reduce(
    (acc, curr) => acc + curr.visitors,
    0
  );

  return (
    <div className="monthly-visitors">
      <h2 className="heading-primary">Monthly Visitors</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={paginatedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="visitors" fill="#82ca9d">
            <LabelList dataKey="visitors" position="mid" fill="#333" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

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

      <p className="text-large">Total visitors this year: {totalVisitors}</p>
    </div>
  );
};

export default MonthlyVisitors;
