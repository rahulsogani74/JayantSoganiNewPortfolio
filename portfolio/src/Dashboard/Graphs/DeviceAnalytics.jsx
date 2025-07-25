import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "../styles/DeviceAnalytics.css";

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

  const COLORS = ["#FF9F40", "#FF6384", "#36A2EB"];

  // Custom label function to display values inside the pie slices
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
    const RADIAN = Math.PI / 180;
    // Calculate the position of the label
    const x = cx + (outerRadius / 2) * Math.cos(-midAngle * RADIAN);
    const y = cy + (outerRadius / 2) * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12} // Adjust font size as necessary
      >
        {value}
      </text>
    );
  };

  return (
    <div className="device-analytics">
      <h2 className="heading-primary">Device Analytics</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={devices}
            dataKey="count"
            nameKey="type"
            cx="50%"
            cy="50%"
            outerRadius={100} // Adjust as necessary
            label={renderLabel} // Use custom label function
            labelLine={false}
          >
            {devices.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-large">
        Total users: {devices.reduce((acc, curr) => acc + curr.count, 0)}
      </p>
    </div>
  );
};

export default DeviceAnalytics;