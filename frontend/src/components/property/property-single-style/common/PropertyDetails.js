"use client";

import React, { useMemo } from "react";

const formatPrice = (price, currency = "USD") => {
  if (!Number.isFinite(Number(price))) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(price));
};

const PropertyDetails = ({ property }) => {
  const columns = useMemo(() => {
    if (!property) return [[], []];

    return [
      [
        {
          label: "Property ID",
          value: property.id || "—",
        },
        {
          label: "Price",
          value: formatPrice(property.price, property.currency),
        },
        {
          label: "Property Size",
          value: property.sqft ? `${property.sqft} Sq Ft` : "—",
        },
        {
          label: "Bathrooms",
          value:
            Number.isFinite(Number(property.baths)) ? property.baths : "—",
        },
        {
          label: "Bedrooms",
          value:
            Number.isFinite(Number(property.beds)) ? property.beds : "—",
        },
      ],
      [
        {
          label: "Garage",
          value: property.garage ?? "—",
        },
        {
          label: "Garage Size",
          value: property.garageSize
            ? `${property.garageSize} Sq Ft`
            : "—",
        },
        {
          label: "Year Built",
          value: property.yearBuilding || "—",
        },
        {
          label: "Property Type",
          value: property.propertyType || "—",
        },
        {
          label: "Property Status",
          value: property.forRent ? "For Rent" : "For Sale",
        },
      ],
    ];
  }, [property]);

  return (
    <div className="row">
      {columns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className={`col-md-6 col-xl-4${
            columnIndex === 1 ? " offset-xl-2" : ""
          }`}
        >
          {column.map((detail, index) => (
            <div
              key={index}
              className="d-flex justify-content-between"
            >
              <div className="pd-list">
                <p className="fw600 mb10 ff-heading dark-color">
                  {detail.label}
                </p>
              </div>
              <div className="pd-list">
                <p className="text mb10">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PropertyDetails;
