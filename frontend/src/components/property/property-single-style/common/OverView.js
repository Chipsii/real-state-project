"use client";

import React from "react";

const OverView = ({ property }) => {
  const overviewData = [
    {
      icon: "flaticon-bed",
      label: "Bedroom",
      value: Number.isFinite(Number(property?.beds)) ? property.beds : "-",
    },
    {
      icon: "flaticon-shower",
      label: "Bath",
      value: Number.isFinite(Number(property?.baths)) ? property.baths : "-",
    },
    {
      icon: "flaticon-event",
      label: "Year Built",
      value: Number.isFinite(Number(property?.yearBuilding))
        ? property.yearBuilding
        : "-",
    },
    {
      icon: "flaticon-garage",
      label: "Garage",
      value: "2",
      xs: true,
    },
    {
      icon: "flaticon-expand",
      label: "Sqft",
      value: Number.isFinite(Number(property?.sqft)) ? property.sqft : "-",
      xs: true,
    },
    {
      icon: "flaticon-home-1",
      label: "Property Type",
      value: property?.propertyType || "-",
    },
  ];

  return (
    <>
      {overviewData.map((item, index) => (
        <div
          key={index}
          className={`col-sm-6 col-lg-4 ${item.xs ? "mb25-xs" : "mb25"}`}
        >
          <div className="overview-element d-flex align-items-center">
            <span className={`icon ${item.icon}`} />
            <div className="ml15">
              <h6 className="mb-0">{item.label}</h6>
              <p className="text mb-0 fz15">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default OverView;
