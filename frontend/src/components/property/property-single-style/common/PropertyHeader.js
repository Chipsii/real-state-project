"use client";

import React, { useMemo } from "react";

const formatMoney = (amount, currency = "USD") => {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${n.toLocaleString()}`;
  }
};

const PropertyHeader = ({ property }) => {
  const yearsAgo = useMemo(() => {
    const y = Number(property?.yearBuilding);
    if (!Number.isFinite(y) || y <= 0) return null;
    const now = new Date().getFullYear();
    return Math.max(0, now - y);
  }, [property?.yearBuilding]);

  const title = property?.title || "-";
  const location = property?.locationText || "-";
  const forRent = Boolean(property?.forRent);

  const beds = Number(property?.beds);
  const baths = Number(property?.baths);
  const sqft = Number(property?.sqft);

  const priceNum = Number(property?.price);
  const currency = property?.currency || "USD";
  const priceText = formatMoney(priceNum, currency);

  const pricePerSqft = useMemo(() => {
    if (!Number.isFinite(priceNum) || !Number.isFinite(sqft) || sqft <= 0) return null;
    return priceNum / sqft;
  }, [priceNum, sqft]);

  return (
    <>
      <div className="col-lg-8">
        <div className="single-property-content mb30-md">
          <h2 className="sp-lg-title">{title}</h2>

          <div className="pd-meta mb15 d-md-flex align-items-center">
            <p className="text fz15 mb-0 bdrr1 pr10 bdrrn-sm">{location}</p>

            <a
              className="ff-heading text-thm fz15 bdrr1 pr10 ml0-sm ml10 bdrrn-sm"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              <i className="fas fa-circle fz10 pe-2" />
              For {forRent ? "rent" : "sale"}
            </a>

            <a
              className="ff-heading bdrr1 fz15 pr10 ml10 ml0-sm bdrrn-sm"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              <i className="far fa-clock pe-2" />
              {yearsAgo !== null ? `${yearsAgo} years ago` : "-"}
            </a>

            <a
              className="ff-heading ml10 ml0-sm fz15"
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              <i className="flaticon-fullscreen pe-2 align-text-top" />
              8721
            </a>
          </div>

          <div className="property-meta d-flex align-items-center">
            <a className="text fz15" href="#" onClick={(e) => e.preventDefault()}>
              <i className="flaticon-bed pe-2 align-text-top" />
              {Number.isFinite(beds) ? beds : "-"} bed
            </a>

            <a className="text ml20 fz15" href="#" onClick={(e) => e.preventDefault()}>
              <i className="flaticon-shower pe-2 align-text-top" />
              {Number.isFinite(baths) ? baths : "-"} bath
            </a>

            <a className="text ml20 fz15" href="#" onClick={(e) => e.preventDefault()}>
              <i className="flaticon-expand pe-2 align-text-top" />
              {Number.isFinite(sqft) ? sqft : "-"} sqft
            </a>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="single-property-content">
          <div className="property-action text-lg-end">
            <div className="d-flex mb20 mb10-md align-items-center justify-content-lg-end">
              <a className="icon mr10" href="#" onClick={(e) => e.preventDefault()}>
                <span className="flaticon-like" />
              </a>
              <a className="icon mr10" href="#" onClick={(e) => e.preventDefault()}>
                <span className="flaticon-new-tab" />
              </a>
              <a className="icon mr10" href="#" onClick={(e) => e.preventDefault()}>
                <span className="flaticon-share-1" />
              </a>
              <a className="icon" href="#" onClick={(e) => e.preventDefault()}>
                <span className="flaticon-printer" />
              </a>
            </div>

            <h3 className="price mb-0">{priceText || "-"}</h3>

            <p className="text space fz15">
              {pricePerSqft !== null
                ? `${formatMoney(pricePerSqft, currency)}/sq ft`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyHeader;
