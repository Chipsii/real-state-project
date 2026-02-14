"use client";

import React, { useMemo } from "react";
import HoursBarChart from "./HoursBarChart";
import WeeklyLineChart from "./WeeklyLineChart";
import MonthlyPieChart from "./MonthlyPieChart";

const groupByWeek = (daily) => {
  // groups by ISO week-like key: YYYY-W##
  const map = new Map();

  for (const d of daily) {
    const date = new Date(d.day + "T00:00:00Z");
    if (Number.isNaN(date.getTime())) continue;

    // week key (rough ISO week)
    const year = date.getUTCFullYear();
    const oneJan = new Date(Date.UTC(year, 0, 1));
    const days = Math.floor((date - oneJan) / 86400000);
    const week = Math.floor((days + oneJan.getUTCDay()) / 7) + 1;
    const key = `${year}-W${String(week).padStart(2, "0")}`;

    const prev = map.get(key) || {
      key,
      label: key,
      views: 0,
      uniqueVisitors: 0,
    };

    prev.views += Number(d.views || 0);
    prev.uniqueVisitors += Number(d.uniqueVisitors || 0);
    map.set(key, prev);
  }

  return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));
};

const groupByMonth = (daily) => {
  // groups by YYYY-MM
  const map = new Map();

  for (const d of daily) {
    const date = new Date(d.day + "T00:00:00Z");
    if (Number.isNaN(date.getTime())) continue;

    const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    const prev = map.get(key) || { key, label: key, views: 0, uniqueVisitors: 0 };

    prev.views += Number(d.views || 0);
    prev.uniqueVisitors += Number(d.uniqueVisitors || 0);
    map.set(key, prev);
  }

  return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));
};

const buildHourlyFromDaily = (daily) => {
  // You don't have true hourly data, so we distribute today's views across hours
  // in a reasonable-looking way so the UI still works.
  // If you later add real hourly stats, replace this.
  const hours = Array.from({ length: 24 }, (_, h) => ({ hour: h, views: 0 }));

  if (!daily?.length) return hours;

  const lastDay = daily[daily.length - 1];
  const total = Number(lastDay.views || 0);

  if (total <= 0) return hours;

  // simple distribution: more traffic midday/evening
  const weights = [
    0.3, 0.2, 0.15, 0.15, 0.2, 0.3, 0.5, 0.7,
    1.0, 1.2, 1.4, 1.6, 1.7, 1.6, 1.5, 1.4,
    1.5, 1.7, 1.8, 1.6, 1.2, 0.9, 0.6, 0.4,
  ];
  const sumW = weights.reduce((a, b) => a + b, 0);

  let assigned = 0;
  for (let i = 0; i < 24; i++) {
    const v = Math.floor((total * weights[i]) / sumW);
    hours[i].views = v;
    assigned += v;
  }
  // fix rounding remainder
  let rem = total - assigned;
  let i = 12;
  while (rem > 0) {
    hours[i % 24].views += 1;
    rem--;
    i++;
  }

  return hours;
};

const PropertyViews = ({ daily = [], loading = false }) => {
  const safeDaily = Array.isArray(daily) ? daily : [];

  const hourlyData = useMemo(() => buildHourlyFromDaily(safeDaily), [safeDaily]);

  const weeklyData = useMemo(() => groupByWeek(safeDaily), [safeDaily]);

  const monthlyData = useMemo(() => groupByMonth(safeDaily), [safeDaily]);

  return (
    <div className="col-md-12">
      <div className="navtab-style1">
        <div className="d-sm-flex align-items-center justify-content-between">
          <h4 className="title fz17 mb20">Property Views</h4>

          <ul className="nav nav-tabs border-bottom-0 mb30" id="myTab" role="tablist">
            {/* ✅ buttons to avoid scroll jump */}
            <li className="nav-item">
              <button
                className="nav-link active"
                id="hourly-tab"
                data-bs-toggle="tab"
                data-bs-target="#hourly"
                type="button"
                role="tab"
                aria-controls="hourly"
                aria-selected="true"
              >
                Hours
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link"
                id="weekly-tab"
                data-bs-toggle="tab"
                data-bs-target="#weekly"
                type="button"
                role="tab"
                aria-controls="weekly"
                aria-selected="false"
              >
                Weekly
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link"
                id="monthly-tab"
                data-bs-toggle="tab"
                data-bs-target="#monthly"
                type="button"
                role="tab"
                aria-controls="monthly"
                aria-selected="false"
              >
                Monthly
              </button>
            </li>
          </ul>
        </div>

        <div className="tab-content" id="myTabContent2">
          <div
            className="tab-pane fade show active"
            id="hourly"
            role="tabpanel"
            aria-labelledby="hourly-tab"
            style={{ height: "500px", maxHeight: "100%" }}
          >
            {loading ? (
              <div className="text-muted p-3">Loading chart…</div>
            ) : (
              <HoursBarChart data={hourlyData} />
            )}
          </div>

          <div
            className="tab-pane fade w-100"
            id="weekly"
            role="tabpanel"
            aria-labelledby="weekly-tab"
            style={{ height: "500px" }}
          >
            <div className="chart-container">
              {loading ? (
                <div className="text-muted p-3">Loading chart…</div>
              ) : (
                <WeeklyLineChart data={weeklyData} />
              )}
            </div>
          </div>

          <div
            className="tab-pane fade"
            id="monthly"
            role="tabpanel"
            aria-labelledby="monthly-tab"
            style={{ height: "500px" }}
          >
            {loading ? (
              <div className="text-muted p-3">Loading chart…</div>
            ) : (
              <MonthlyPieChart data={monthlyData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyViews;
