import React, { useEffect, useState } from "react";
import "./styles/PageVisitAnalytics.css";

const PageVisitAnalytics = () => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const fetchPageVisitData = () => {
      let pageData = localStorage.getItem("pageVisits");
      if (!pageData) {
        pageData = JSON.stringify([
          { name: "Homepage", visits: 300 },
          { name: "About Us", visits: 100 },
          { name: "Contact", visits: 80 },
          { name: "Services", visits: 120 },
        ]);
        localStorage.setItem("pageVisits", pageData);
      }
      setPages(JSON.parse(pageData));
    };
    fetchPageVisitData();
  }, []);

  return (
    <div className="page-visit-analytics">
      <h2 class="heading-primary">Page Visits</h2>
      <ul class="list-none">
        {pages.map((page, index) => (
          <li key={index} class="list-item">
            {page.name}: {page.visits} visits
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PageVisitAnalytics;
