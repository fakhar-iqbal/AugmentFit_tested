import React from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function UserAgeChart({ usersData, screenWidth, totalUsers }) {
  const data = [];
  const COLORS = [
    ["#6a11cb", "#2575fc"],
    ["#2c3e50", "#34495e"],
    ["#1a2980", "#26d0ce"],
    ["#e74c3c", "#c0392b"],
    ["#4a90e2", "#2c3e50"],
  ];

  Object.keys(usersData).map((key) => {
    data.push({ name: "BMI " + key, value: usersData[key] + 3 });
  });

  return (
    <PieChart
      width={screenWidth > 991 ? screenWidth / 5 : screenWidth / 1.5}
      height={
        screenWidth > 1400
          ? screenWidth / 5
          : screenWidth > 991
          ? screenWidth / 3
          : screenWidth > 767
          ? screenWidth / 3
          : screenWidth / 2
      }
    >
      {COLORS.map((gradient, index) => (
        <defs key={`gradient-${index}`}>
          <linearGradient
            id={`gradientColor-${index}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={gradient[0]} /> {/* Start color */}
            <stop offset="100%" stopColor={gradient[1]} /> {/* End color */}
          </linearGradient>
        </defs>
      ))}
      <Pie
        data={data}
        // cx={120}
        // cy={200}
        innerRadius={screenWidth > 991 ? screenWidth / 16 : screenWidth / 12}
        outerRadius={screenWidth > 991 ? screenWidth / 11 : screenWidth / 8}
        fill="#8884d8"
        label={(e) =>
          e.value > 0
            ? e.name + ": " + ((e.value / totalUsers) * 100).toFixed(1) + "%"
            : null
        }
        labelLine={false}
        fontSize={16}
        paddingAngle={5}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            stroke="none"
            fill={`url(#gradientColor-${index % COLORS.length})`}
          />
        ))}
      </Pie>
      {/* <Tooltip /> */}
    </PieChart>
  );
}
