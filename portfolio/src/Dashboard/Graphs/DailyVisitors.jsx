import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import "../styles/DailyVisitors.css";

const DailyVisitors = () => {
  // Hardcoded daily visitor data
  const dailyVisitors = [
    { date: "Mon", visitors: 50 },
    { date: "Tue", visitors: 85 },
    { date: "Wed", visitors: 90 },
    { date: "Thu", visitors: 70 },
    { date: "Fri", visitors: 95 },
    { date: "Sat", visitors: 80 },
    { date: "Sun", visitors: 100 },
  ];

  // Calculate total visitors
  const totalVisitors = dailyVisitors.reduce(
    (acc, curr) => acc + curr.visitors,
    0
  );

  // Custom label function to position labels differently
  const CustomizedLabel = ({ x, y, value, index }) => {
    const isFirst = index === 0;
    const isLast = index === dailyVisitors.length - 1;

    let labelPosition = { textAnchor: "middle", x: x, y: y + 20 }; // Default position for middle labels

    if (isFirst) {
      labelPosition = { textAnchor: "start", x: x + 5, y: y + 5 }; // Right position for first label
    } else if (isLast) {
      labelPosition = { textAnchor: "end", x: x - 5, y: y + 10 }; // Left position for last label
    }

    return (
      <text {...labelPosition} fill="#000">
        {value}
      </text>
    );
  };

  return (
    <div className="daily-visitors">
      <h2 className="heading-primary">Daily Visitors</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyVisitors}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" interval={0} tick={{ fontSize: 14 }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="visitors" stroke="#1e90ff">
              <LabelList
                dataKey="visitors"
                content={<CustomizedLabel />} // Use custom label for positioning
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-large">Total visitors this week: {totalVisitors}</p>
    </div>
  );
};

export default DailyVisitors;
