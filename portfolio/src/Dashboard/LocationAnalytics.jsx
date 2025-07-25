import React, { useEffect, useState } from "react";
import "./styles/LocationAnalytics.css";

const LocationAnalytics = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocationData = () => {
      let locationData = localStorage.getItem("locations");
      if (!locationData) {
        locationData = JSON.stringify([
          { country: "USA", count: 120 },
          { country: "India", count: 200 },
          { country: "UK", count: 80 },
          { country: "Canada", count: 60 },
        ]);
        localStorage.setItem("locations", locationData);
      }
      setLocations(JSON.parse(locationData));
    };
    fetchLocationData();
  }, []);

  return (
    <div className="location-analytics">
      <h2 class="heading-primary">Visitor Locations</h2>
      <ul class="list-none">
        {locations.map((location, index) => (
          <li key={index} class="list-item">
            {location.country}: {location.count} visitors
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationAnalytics;
