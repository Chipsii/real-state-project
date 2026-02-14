"use client";

import React from "react";

const StatCard = ({ text, value, icon, loading }) => {
  return (
    <div className="col-sm-8 col-xxl-4">
      <div className="d-flex justify-content-between statistics_funfact">
        <div className="details">
          <div className="text fz25">{text}</div>
          <div className="title">
            {loading ? "—" : value}
          </div>
        </div>
        <div className="icon text-center">
          <i className={icon} />
        </div>
      </div>
    </div>
  );
};

const TopStateBlock = ({ stats, loading }) => {
  const totals = stats?.totals || {};

  return (
    <>
      <StatCard
        text="All Properties"
        value={stats?.totalListings ?? 0}
        icon="flaticon-home"
        loading={loading}
      />

      <StatCard
        text="Total Views"
        value={totals.views ?? 0}
        icon="flaticon-search-chart"
        loading={loading}
      />

      <StatCard
        text="Unique Visitors"
        value={totals.uniqueVisitors ?? 0}
        icon="flaticon-review"
        loading={loading}
      />

      {/* <StatCard
        text="Total Favorites"
        value={totals.saveClicks ?? 0}
        icon="flaticon-like"
        loading={loading}
      /> */}
    </>
  );
};

export default TopStateBlock;
