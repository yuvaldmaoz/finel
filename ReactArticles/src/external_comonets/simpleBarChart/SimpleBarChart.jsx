import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./SimpleBarChart.css";

const SimpleBarChart = ({ data, dateRange, setDateRange, onDateChange }) => (
  <div className="simple-bar-chart-container">
    <h2 className="simple-bar-chart-title">כמות הזמנות לפי חודש</h2>
    <div
      style={{
        display: "flex",
        gap: "10px",
        alignItems: "center",
        marginBottom: "15px",
      }}
    >
      <input
        type="month"
        value={dateRange.from}
        onChange={(e) =>
          setDateRange((prev) => ({ ...prev, from: e.target.value }))
        }
        style={{ padding: "5px" }}
      />
      <span>עד</span>
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
    <ResponsiveContainer width="100%" height={230}>
      <BarChart data={data} barCategoryGap="20%" barGap={5}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="client_orders"
          fill="#3b82f6"
          radius={[8, 8, 0, 0]}
          name="הזמנות מלקוחות"
        />
        <Bar
          dataKey="store_orders"
          fill="#f97316"
          radius={[8, 8, 0, 0]}
          name="הזמנות חנות"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default SimpleBarChart;
