"use client";
import React from "react";
import Link from "next/link";

const FilterHeader = ({
  value,
  onChange,
  onSubmit,
  loading = false,
}) => {
  return (
    <div className="dashboard_search_meta d-md-flex align-items-center justify-content-xxl-end">
      <div className="item1 mb15-sm">
        <div className="search_area">
          <input
            type="text"
            className="form-control bdrs12"
            placeholder="Search"
            value={value.search || ""}
            onChange={(e) => onChange({ search: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSubmit?.();
              }
            }}
            disabled={loading}
          />
          <label>
            <span className="flaticon-search" />
          </label>
        </div>
      </div>

      <div className="page_control_shorting bdr1 bdrs12 py-2 ps-3 pe-2 mx-1 mx-xxl-3 bgc-white mb15-sm maxw160">
        <div className="pcs_dropdown d-flex align-items-center">
          <span style={{ minWidth: "50px" }} className="title-color">
            Sort by:
          </span>

          <select
            className="form-select show-tick"
            value={value.sort || "createdAt_desc"}
            onChange={(e) => {
              onChange({ sort: e.target.value });
              // auto-apply
              onSubmit?.();
            }}
            disabled={loading}
          >
            <option value="createdAt_desc">Newest</option>
            <option value="createdAt_asc">Oldest</option>
            <option value="price_asc">Price Low</option>
            <option value="price_desc">Price High</option>
            <option value="sqft_desc">Sqft High</option>
            <option value="sqft_asc">Sqft Low</option>
            <option value="yearBuilding_desc">Year New</option>
            <option value="yearBuilding_asc">Year Old</option>
          </select>
        </div>
      </div>

      {/* ✅ use Link instead of <a href="#"> */}
      <Link href="/dashboard-add-property" className="ud-btn btn-thm">
        Add New Property
        <i className="fal fa-arrow-right-long" />
      </Link>
    </div>
  );
};

export default FilterHeader;
