"use client";

import React, { useMemo } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

const isGood = (v) => Number.isFinite(Number(v));

function getLatLng(property) {
  if (isGood(property?.lat) && isGood(property?.lng)) {
    const lat = Number(property.lat);
    const lng = Number(property.lng);
    if (!(lat === 0 && lng === 0)) return { lat, lng };
  }

  const coords = Array.isArray(property?.geo?.coordinates)
    ? property.geo.coordinates
    : null;
  if (coords?.length >= 2 && isGood(coords[0]) && isGood(coords[1])) {
    const lng = Number(coords[0]);
    const lat = Number(coords[1]);
    if (!(lat === 0 && lng === 0)) return { lat, lng };
  }

  return null;
}

const mapContainerStyle = {
  width: "100%",
  height: 260,
  borderRadius: 12,
  overflow: "hidden",
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  clickableIcons: false,
  gestureHandling: "greedy",
  styles: [
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ lightness: 35 }] },
    { featureType: "water", elementType: "geometry", stylers: [{ lightness: 10 }] },
    { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ lightness: 20 }] },
  ],
};

const Field = ({ label, value }) => (
  <div className="d-flex justify-content-between gap-3">
    <div className="fw600 ff-heading dark-color">{label}</div>
    <div className="text">{value || "—"}</div>
  </div>
);

const PropertyAddress = ({ property }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const latLng = useMemo(() => getLatLng(property), [property]);

  const addressLine = property?.locationText || property?.location || "";
  const city = property?.city || "";
  const state = property?.state || property?.stateCounty || "";
  const zip = property?.zip || property?.postalCode || "";
  const area = property?.area || property?.neighborhood || "";
  const country = property?.country || "";

  const mapsQuery = latLng
    ? `${latLng.lat},${latLng.lng}`
    : [addressLine, city, state, zip, country].filter(Boolean).join(", ");

  const openMapsUrl = mapsQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`
    : "#";

  return (
    <>
      {/* Top info grid (like screenshot) */}
      <div className="col-12">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="d-grid gap-2">
              <Field label="Address" value={addressLine} />
              <Field label="City" value={city} />
              <Field label="State/county" value={state} />
            </div>
          </div>

          <div className="col-md-6">
            <div className="d-grid gap-2">
              <Field label="Zip/Postal Code" value={zip} />
              <Field label="Area" value={area} />
              <Field label="Country" value={country} />
            </div>
          </div>
        </div>
      </div>

      {/* Map card */}
      <div className="col-12">
        <div
          style={{
            marginTop: 22,
            background: "#dcebf7", 
            borderRadius: 12,
            padding: 14,
          }}
        >
          <div style={{ position: "relative" }}>
            <a
              href={openMapsUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                position: "absolute",
                right: 14,
                top: 14,
                zIndex: 5,
                background: "#fff",
                color: "#0f172a",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14,
                padding: "10px 14px",
                borderRadius: 12,
                boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              Open on Google Maps
              <span style={{ fontSize: 16, lineHeight: 1 }} aria-hidden>
                ↗
              </span>
            </a>

            {/* Center marker button (like screenshot) */}
            <button
              type="button"
              aria-label="Center marker"
              onClick={() => {
                // optional: no-op or you can open maps
                window.open(openMapsUrl, "_blank", "noopener,noreferrer");
              }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 5,
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "none",
                background: "#0b1220",
                boxShadow: "0 18px 35px rgba(0,0,0,0.18)",
                display: "grid",
                placeItems: "center",
              }}
            >
              {/* simple “pin” icon */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 10,
                  border: "2px solid rgba(255,255,255,0.85)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.85)",
                  }}
                />
              </div>
            </button>

            {/* Map itself */}
            <div style={mapContainerStyle}>
              {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#e9eef5",
                    display: "grid",
                    placeItems: "center",
                    color: "#334155",
                    fontSize: 14,
                    borderRadius: 12,
                  }}
                >
                  Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                </div>
              ) : !isLoaded ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#e9eef5",
                    display: "grid",
                    placeItems: "center",
                    color: "#334155",
                    fontSize: 14,
                    borderRadius: 12,
                  }}
                >
                  Loading map…
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={latLng || { lat: 23.78000285364817, lng: 90.37149088261403 }}
                  zoom={14}
                  options={mapOptions}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyAddress;
