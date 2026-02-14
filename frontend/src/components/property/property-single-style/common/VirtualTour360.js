"use client";

import React from "react";

const VirtualTour360 = ({ property }) => {
  const url = property?.media?.virtualTourUrl;

  if (!url) return null;

  return (
    <div className="col-md-12">
      <div className="bdrs12 overflow-hidden">
        <iframe
          src={url}
          title="360 Virtual Tour"
          className="w-100 h100"
          style={{ minHeight: 400, border: "0" }}
          allow="xr-spatial-tracking; fullscreen"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default VirtualTour360;
