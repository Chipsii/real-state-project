"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

export default function MapInner({ lat, lng, onChange }) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const mapRef = useRef(null);

  useEffect(() => setMounted(true), []);

  const hasCoords =
    Number.isFinite(Number(lat)) && Number.isFinite(Number(lng));

  const center = useMemo(
    () => (hasCoords ? { lat: Number(lat), lng: Number(lng) } : { lat: 51.505, lng: -0.09 }),
    [hasCoords, lat, lng]
  );

  const boxStyle = { height: 550, width: "100%" };

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    // libraries: ["places"], // enable if you later add Autocomplete
  });

  // Move map when lat/lng changes (similar to your MoveMap)
  useEffect(() => {
    if (!mapRef.current) return;
    if (!hasCoords) return;

    mapRef.current.panTo({ lat: Number(lat), lng: Number(lng) });
    mapRef.current.setZoom(14);
  }, [hasCoords, lat, lng]);

  async function searchLocation() {
    if (!query.trim()) return;
    if (!window.google?.maps) return;

    try {
      setLoading(true);

      const geocoder = new window.google.maps.Geocoder();
      const { results } = await geocoder.geocode({ address: query });

      if (!results?.length) {
        alert("Location not found");
        return;
      }

      const loc = results[0].geometry.location;
      onChange({ lat: loc.lat(), lng: loc.lng() });
    } catch (err) {
      console.error(err);
      alert("Failed to search location");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      searchLocation();
    }
  }

  if (!mounted) return <div style={boxStyle} />;
  if (loadError) return <div style={boxStyle}>Failed to load Google Maps</div>;
  if (!isLoaded) return <div style={boxStyle}>Loading map…</div>;

  return (
    <div style={{ width: "100%" }}>
      {/* 🔍 Search bar */}
      <div style={{ marginBottom: 10, display: "flex", gap: 8 }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search location (city, address, landmark)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="ud-btn btn-thm"
          disabled={loading}
          onClick={searchLocation}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* 🗺 Google Map */}
      <div style={boxStyle} className="h550">
        <GoogleMap
          mapContainerStyle={boxStyle}
          center={center}
          zoom={13}
          onLoad={(map) => (mapRef.current = map)}
          onUnmount={() => (mapRef.current = null)}
          onClick={(e) => {
            const nextLat = e.latLng?.lat();
            const nextLng = e.latLng?.lng();
            if (typeof nextLat === "number" && typeof nextLng === "number") {
              onChange({ lat: nextLat, lng: nextLng });
            }
          }}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {hasCoords && <Marker position={{ lat: Number(lat), lng: Number(lng) }} />}
        </GoogleMap>
      </div>
    </div>
  );
}
