"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const WeeklyLineChart = ({ data = [] }) => {
  const chartData = useMemo(() => {
    const arr = Array.isArray(data) ? data : [];
    return arr.map((d) => ({
      week: d.label || d.key || "",
      views: Number(d.views || 0),
      uniqueVisitors: Number(d.uniqueVisitors || 0),
    }));
  }, [data]);

  if (!chartData.length) {
    return <div className="text-muted p-3">No weekly data.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="views" activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="uniqueVisitors" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeeklyLineChart;
