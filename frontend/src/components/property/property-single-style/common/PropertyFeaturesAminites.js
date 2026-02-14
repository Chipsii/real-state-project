"use client";

import React, { useMemo } from "react";

const PropertyFeaturesAminites = ({ property }) => {
  const items = useMemo(() => {
    const list = [
      ...(property?.features || []),
      ...(property?.tags || []),
    ]
      .map((v) => String(v).trim())
      .filter(Boolean);

    return Array.from(new Set(list));
  }, [property?.features, property?.tags]);

  const columns = useMemo(() => {
    const cols = [[], [], []];
    items.forEach((item, idx) => {
      cols[idx % 3].push(item);
    });
    return cols;
  }, [items]);

  if (!items.length) {
    return (
      <div className="col-12">
        <p className="text">No features or amenities listed.</p>
      </div>
    );
  }

  return (
    <>
      {columns.map((col, colIndex) => (
        <div key={colIndex} className="col-sm-6 col-md-4">
          <div className="pd-list">
            {col.map((item, index) => (
              <p key={index} className="text mb10">
                <i className="fas fa-circle fz6 align-middle pe-2" />
                {item}
              </p>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default PropertyFeaturesAminites;
