import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./SimpleBarChart.css"; // הוספת ייבוא CSS

const SimpleBarChart = ({ data }) => (
  <div className="simple-bar-chart-container">
    <h2 className="simple-bar-chart-title">כמות הזמנות לפי חודש</h2>
    <ResponsiveContainer width="100%" height={230}>
      <BarChart data={data} barSize={60}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total_objects" fill="#22c55e" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default SimpleBarChart;
