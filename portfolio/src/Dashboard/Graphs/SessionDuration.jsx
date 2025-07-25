import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "../styles/SessionDuration.css";

const SessionDuration = () => {
  const sessionDuration = [
    { name: "1-3 mins", value: 100 },
    { name: "3-5 mins", value: 80 },
    { name: "5-10 mins", value: 60 },
  ];

  const totalSessions = sessionDuration.reduce(
    (acc, curr) => acc + curr.value,
    0
  );

  // Custom label function to display values inside the pie slices
  const renderLabel = ({ cx, cy, midAngle, outerRadius, value }) => {
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
    <div className="session-duration">
      <h2 className="heading-primary">Average Session Duration</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={sessionDuration}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={renderLabel} // Use custom label function to show values inside slices
            labelLine={false}
          >
            {sessionDuration.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={["#0088FE", "#00C49F", "#FFBB28"][index % 3]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-large">Total sessions: {totalSessions}</p>
    </div>
  );
};

export default SessionDuration;
