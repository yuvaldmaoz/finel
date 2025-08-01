import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./SimplePieChart.css"; // ייבוא קובץ העיצוב

const COLORS = [
  "#22c55e",
  "#0ea5e9",
  "#facc15",
  "#ef4444",
  "#a78bfa",
  "#f472b6",
];

// Label מותאם שממקם את המספרים קרוב יותר למרכז
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  value,
}) => {
  const RADIAN = Math.PI / 180;
  // מיקום קרוב יותר למרכז (innerRadius + (outerRadius-innerRadius)*0.5)
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#333"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={14}
    >
      {value}
    </text>
  );
};

const SimplePieChart = ({ data, dateRange, setDateRange, onDateChange }) => (
  <div className="simple-pie-chart-container">
    <h2 className="simple-bar-chart-title">משימות לעובד</h2>
    <div
      style={{
        display: "flex",
        gap: "10px",
        alignItems: "center",

        marginBottom: "15px",
      }}
    >
      <span>from :</span>

      <input
        type="month"
        value={dateRange.from}
        onChange={(e) =>
          setDateRange((prev) => ({ ...prev, from: e.target.value }))
        }
        style={{ padding: "5px" }}
      />
      <span>to :</span>
      <input
        type="month"
        value={dateRange.to}
        onChange={(e) =>
          setDateRange((prev) => ({ ...prev, to: e.target.value }))
        }
        style={{ padding: "5px" }}
      />
      <button onClick={onDateChange} style={{ padding: "5px 10px" }}>
        הצג
      </button>
    </div>
    <PieChart width={400} height={200}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={75}
        dataKey="task_count"
        label={renderCustomLabel}
        labelLine={false}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </div>
);

export default SimplePieChart;
