"use client";

import React, { useMemo } from "react";

const valueOrDash = (v) => {
  if (v === 0) return 0;
  if (v === false) return "No";
  if (v === true) return "Yes";
  if (v === null || v === undefined || v === "") return "—";
  return v;
};

const OverView = ({ property }) => {
  const overviewData = useMemo(() => {
    if (!property) return [];

    return [
      {
        icon: "flaticon-bed",
        label: "Bedroom",
        value: valueOrDash(property.beds),
      },
      {
        icon: "flaticon-shower",
        label: "Bath",
        value: valueOrDash(property.baths),
      },
      {
        icon: "flaticon-event",
        label: "Year Built",
        value: valueOrDash(
          property.yearBuilt ?? property.yearBuilding
        ),
      },
      {
        icon: "flaticon-garage",
        label: "Garage",
        value: valueOrDash(property.garages),
      },
      {
        icon: "flaticon-expand",
        label: "Sqft",
        value: Number.isFinite(Number(property.sqft))
          ? property.sqft
          : "—",
      },
      {
        icon: "flaticon-home-1",
        label: "Property Type",
        value: valueOrDash(property.propertyType),
      },
    ];
  }, [property]);

  return (
    <>
      {overviewData.map((item, index) => (
        <div key={index} className="col-sm-6 col-md-4 col-xl-2">
          <div className="overview-element mb30 d-flex align-items-center">
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
