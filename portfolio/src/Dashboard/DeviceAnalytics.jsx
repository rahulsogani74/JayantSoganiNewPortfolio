import React, { useEffect, useState } from "react";
import "./styles/DeviceAnalytics.css";

const DeviceAnalytics = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchDeviceData = () => {
      let deviceData = localStorage.getItem("devices");
      if (!deviceData) {
        deviceData = JSON.stringify([
          { type: "Desktop", count: 300 },
          { type: "Mobile", count: 500 },
          { type: "Tablet", count: 100 },
        ]);
        localStorage.setItem("devices", deviceData);
      }
      setDevices(JSON.parse(deviceData));
    };
    fetchDeviceData();
  }, []);

  return (
    <div className="device-analytics">
      <h2 class="heading-primary">Device Analytics</h2>
      <ul class="list-none">
        {devices.map((device, index) => (
          <li key={index} class="list-item">
            {device.type}: {device.count} users
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeviceAnalytics;
