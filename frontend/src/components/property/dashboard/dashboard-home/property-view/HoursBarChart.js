"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const formatHour = (h) => {
  const hour = Number(h);
  if (!Number.isFinite(hour)) return "";
  const suffix = hour >= 12 ? "PM" : "AM";
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}${suffix}`;
};

const HoursBarChart = ({ data = [] }) => {
  const chartData = useMemo(() => {
    const arr = Array.isArray(data) ? data : [];
    return arr.map((d) => ({
      hour: d.hour,
      label: formatHour(d.hour),
      views: Number(d.views || 0),
    }));
  }, [data]);

  if (!chartData.length) {
    return <div className="text-muted p-3">No hourly data.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" strokeLeft="transparent" />
        <XAxis
          dataKey="label"
          interval="preserveStartEnd"
          tick={{ fontSize: 12 }}
        />
        <YAxis allowDecimals={false} />
        <Tooltip cursor={{ fill: "transparent" }} />
        <Bar dataKey="views" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HoursBarChart;
