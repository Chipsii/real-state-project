"use client";

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// fallback color palette (cycles automatically)
const COLORS = [
  "#4e79a7",
  "#59a14f",
  "#f28e2b",
  "#e15759",
  "#76b7b2",
  "#edc949",
  "#af7aa1",
  "#ff9da7",
];

const formatMonthLabel = (key) => {
  // key: "2026-02"
  if (!key) return "";
  const [y, m] = key.split("-");
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, 1));
  if (Number.isNaN(date.getTime())) return key;
  return date.toLocaleString(undefined, { month: "short", year: "numeric" });
};

const MonthlyPieChart = ({ data = [] }) => {
  const chartData = useMemo(() => {
    const arr = Array.isArray(data) ? data : [];
    return arr
      .map((d) => ({
        key: d.key,
        name: formatMonthLabel(d.key),
        value: Number(d.views || 0),
      }))
      .filter((d) => d.value > 0);
  }, [data]);

  if (!chartData.length) {
    return <div className="text-muted p-3">No monthly data.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {chartData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MonthlyPieChart;
