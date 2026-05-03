"use client";

import React, { useMemo } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

const isGood = (v) => Number.isFinite(Number(v));

function getLatLng(property) {
  const coords = Array.isArray(property?.geo?.coordinates)
    ? property.geo.coordinates
    : null;

  if (coords?.length >= 2 && isGood(coords[0]) && isGood(coords[1])) {
    const lng = Number(coords[0]);
    const lat = Number(coords[1]);
    if (!(lat === 0 && lng === 0)) return { lat, lng };
  }

  if (isGood(property?.lat) && isGood(property?.lng)) {
    const lat = Number(property.lat);
    const lng = Number(property.lng);
    if (!(lat === 0 && lng === 0)) return { lat, lng };
  }

  return null;
}

const mapContainerStyle = {
  width: "100%",
  height: 280, // slightly taller = better UX
  borderRadius: 14,
  overflow: "hidden",
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true, // enable zoom for better UX
  clickableIcons: false,
  gestureHandling: "greedy",
  styles: [
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ lightness: 35 }] },
    { featureType: "water", elementType: "geometry", stylers: [{ lightness: 10 }] },
  ],
};

const Field = ({ label, value }) => (
  <div className="d-flex justify-content-between gap-3">
    <div className="fw600 ff-heading dark-color">{label}</div>
    <div className="text text-end">{value || "—"}</div>
  </div>
);

const PropertyAddress = ({ property }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  const latLng = useMemo(() => getLatLng(property), [property]);

  const addressLine = property?.locationText || "";
  const city = property?.city || "";
  const thana = property?.thana || "";
  const neighborhood = property?.neighborhood || "";
  const zip = property?.zip || "";

  const mapsQuery = latLng
    ? `${latLng.lat},${latLng.lng}`
    : [addressLine, neighborhood, thana, city, zip]
        .filter(Boolean)
        .join(", ");

  const openMapsUrl = mapsQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`
    : "#";

  const fallbackCenter = { lat: 23.78000285364817, lng: 90.37149088261403 };
  const center = latLng || fallbackCenter;

  return (
    <>
      {/* INFO GRID */}
      <div className="col-12">
        <div className="row g-3">
          <div className="col-md-6">
            <div className="d-grid gap-2">
              <Field label="Address" value={addressLine} />
              <Field label="City" value={city} />
              <Field label="Thana" value={thana} />
            </div>
          </div>

          <div className="col-md-6">
            <div className="d-grid gap-2">
              <Field label="Neighborhood" value={neighborhood} />
              <Field label="Zip" value={zip} />
              <Field
                label="Coordinates"
                value={latLng ? `${center.lat}, ${center.lng}` : ""}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAP CARD */}
      <div className="col-12">
        <div
          style={{
            marginTop: 24,
            background: "#eef5fb",
            borderRadius: 16,
            padding: 16,
          }}
        >
          <div style={{ position: "relative" }}>
            {/* Open Maps Button */}
            <a
              href={openMapsUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                position: "absolute",
                right: 12,
                top: 12,
                zIndex: 5,
                background: "#fff",
                fontWeight: 600,
                fontSize: 14,
                padding: "8px 12px",
                borderRadius: 10,
                boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                textDecoration: "none",
              }}
            >
              Open in Maps ↗
            </a>

            {/* MAP */}
            <div style={mapContainerStyle}>
              {!apiKey ? (
                <MapPlaceholder text="Missing Google Maps API key" />
              ) : loadError ? (
                <MapPlaceholder text="Failed to load map" />
              ) : !isLoaded ? (
                <MapPlaceholder text="Loading map…" />
              ) : (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={center}
                  zoom={latLng ? 15 : 12}
                  options={mapOptions}
                >
                  {latLng && <MarkerF position={latLng} />}
                </GoogleMap>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* 🔹 Small reusable placeholder */
const MapPlaceholder = ({ text }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: "#e9eef5",
      display: "grid",
      placeItems: "center",
      color: "#334155",
      fontSize: 14,
      borderRadius: 14,
    }}
  >
    {text}
  </div>
);

export default PropertyAddress;