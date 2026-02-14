"use client";

import React, { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Map from "./Map";

// ✅ Dynamically import react-select with SSR disabled — this is the
//    definitive fix for the hydration mismatch on auto-generated IDs.
const Select = dynamic(() => import("react-select"), { ssr: false });

const customStyles = {
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected
      ? "#eb6753"
      : isFocused
      ? "#eb675312"
      : undefined,
  }),
};

const BD_DISTRICTS = [
  {
    label: "Dhaka Division",
    options: [
      { value: "Dhaka", label: "Dhaka" },
      { value: "Gazipur", label: "Gazipur" },
      { value: "Narayanganj", label: "Narayanganj" },
      { value: "Tangail", label: "Tangail" },
      { value: "Kishoreganj", label: "Kishoreganj" },
      { value: "Manikganj", label: "Manikganj" },
      { value: "Munshiganj", label: "Munshiganj" },
      { value: "Narsingdi", label: "Narsingdi" },
      { value: "Faridpur", label: "Faridpur" },
      { value: "Gopalganj", label: "Gopalganj" },
      { value: "Madaripur", label: "Madaripur" },
      { value: "Rajbari", label: "Rajbari" },
      { value: "Shariatpur", label: "Shariatpur" },
    ],
  },
  {
    label: "Chattogram Division",
    options: [
      { value: "Chattogram", label: "Chattogram" },
      { value: "Cox's Bazar", label: "Cox's Bazar" },
      { value: "Cumilla", label: "Cumilla" },
      { value: "Feni", label: "Feni" },
      { value: "Noakhali", label: "Noakhali" },
      { value: "Brahmanbaria", label: "Brahmanbaria" },
      { value: "Chandpur", label: "Chandpur" },
      { value: "Lakshmipur", label: "Lakshmipur" },
      { value: "Rangamati", label: "Rangamati" },
      { value: "Khagrachari", label: "Khagrachari" },
      { value: "Bandarban", label: "Bandarban" },
    ],
  },
  {
    label: "Khulna Division",
    options: [
      { value: "Khulna", label: "Khulna" },
      { value: "Jashore", label: "Jashore" },
      { value: "Satkhira", label: "Satkhira" },
      { value: "Bagerhat", label: "Bagerhat" },
      { value: "Kushtia", label: "Kushtia" },
      { value: "Jhenaidah", label: "Jhenaidah" },
      { value: "Magura", label: "Magura" },
      { value: "Narail", label: "Narail" },
      { value: "Chuadanga", label: "Chuadanga" },
      { value: "Meherpur", label: "Meherpur" },
    ],
  },
  {
    label: "Rajshahi Division",
    options: [
      { value: "Rajshahi", label: "Rajshahi" },
      { value: "Bogura", label: "Bogura" },
      { value: "Pabna", label: "Pabna" },
      { value: "Natore", label: "Natore" },
      { value: "Sirajganj", label: "Sirajganj" },
      { value: "Chapainawabganj", label: "Chapainawabganj" },
      { value: "Joypurhat", label: "Joypurhat" },
      { value: "Naogaon", label: "Naogaon" },
    ],
  },
  {
    label: "Rangpur Division",
    options: [
      { value: "Rangpur", label: "Rangpur" },
      { value: "Dinajpur", label: "Dinajpur" },
      { value: "Kurigram", label: "Kurigram" },
      { value: "Gaibandha", label: "Gaibandha" },
      { value: "Nilphamari", label: "Nilphamari" },
      { value: "Lalmonirhat", label: "Lalmonirhat" },
      { value: "Panchagarh", label: "Panchagarh" },
      { value: "Thakurgaon", label: "Thakurgaon" },
    ],
  },
  {
    label: "Sylhet Division",
    options: [
      { value: "Sylhet", label: "Sylhet" },
      { value: "Moulvibazar", label: "Moulvibazar" },
      { value: "Habiganj", label: "Habiganj" },
      { value: "Sunamganj", label: "Sunamganj" },
    ],
  },
  {
    label: "Barishal Division",
    options: [
      { value: "Barishal", label: "Barishal" },
      { value: "Bhola", label: "Bhola" },
      { value: "Patuakhali", label: "Patuakhali" },
      { value: "Pirojpur", label: "Pirojpur" },
      { value: "Jhalokathi", label: "Jhalokathi" },
      { value: "Barguna", label: "Barguna" },
    ],
  },
  {
    label: "Mymensingh Division",
    options: [
      { value: "Mymensingh", label: "Mymensingh" },
      { value: "Jamalpur", label: "Jamalpur" },
      { value: "Netrokona", label: "Netrokona" },
      { value: "Sherpur", label: "Sherpur" },
    ],
  },
];

const LocationField = ({ value, onChange, errors = {}, touched = false }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const hasCoords =
    Number.isFinite(Number(value.lat)) && Number.isFinite(Number(value.lng));

  const flatOptions = useMemo(
    () => BD_DISTRICTS.flatMap((g) => g.options),
    []
  );

  const selectedCity =
    flatOptions.find((o) => o.value === value.city) ?? null;

  return (
    <form className="form-style1">
      <div className="row">
        {/* Address / locationText */}
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Address (House/Road/Area)
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="House 12, Road 5, Dhanmondi"
              value={value.locationText ?? ""}
              onChange={(e) => onChange({ locationText: e.target.value })}
            />
            {touched && errors.locationText && (
              <p style={{ color: "red", marginTop: 6, marginBottom: 0 }}>
                {errors.locationText}
              </p>
            )}
          </div>
        </div>

        {/* City / District (Bangladesh) */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              City / District
            </label>

            {/* ✅ Only render Select on the client to prevent any hydration mismatch.
                The dynamic import already handles this, but the mounted guard
                provides a consistent placeholder so layout doesn't shift. */}
            {mounted ? (
              <Select
                instanceId="district-select"  /* ← stable ID, no more counter mismatch */
                value={selectedCity}
                onChange={(opt) => onChange({ city: opt ? opt.value : "" })}
                options={BD_DISTRICTS}
                styles={customStyles}
                className="select-custom pl-0"
                classNamePrefix="select"
                isMulti={false}
                placeholder="Select district"
              />
            ) : (
              /* SSR placeholder — same height so no layout shift */
              <div
                className="select-custom pl-0"
                style={{
                  height: 38,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  background: "#fff",
                }}
              />
            )}

            {touched && errors.city && (
              <p style={{ color: "red", marginTop: 6, marginBottom: 0 }}>
                {errors.city}
              </p>
            )}
          </div>
        </div>

        {/* Upazila/Thana */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Upazila / Thana
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Dhanmondi / Kotwali / Sadar"
              value={value.thana ?? ""}
              onChange={(e) => onChange({ thana: e.target.value })}
            />
          </div>
        </div>

        {/* Area / Neighborhood */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Area / Neighborhood
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Banani, Mirpur, Uttara"
              value={value.neighborhood ?? ""}
              onChange={(e) => onChange({ neighborhood: e.target.value })}
            />
          </div>
        </div>

        {/* Post Code */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Post Code
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 1209"
              value={value.zip ?? ""}
              onChange={(e) => onChange({ zip: e.target.value })}
            />
          </div>
        </div>

        {/* Map */}
        <div className="col-sm-12">
          <div className="mb20 mt30">
            <label className="heading-color ff-heading fw600 mb30">
              Place the listing pin on the map
            </label>

            <Map
              lat={value.lat}
              lng={value.lng}
              onChange={({ lat, lng }) => onChange({ lat, lng })}
            />

            {touched && (errors.lat || errors.lng) && (
              <p style={{ color: "red", marginTop: 10, marginBottom: 0 }}>
                {errors.lat || errors.lng}
              </p>
            )}

            {/* Coordinates display */}
            <div className="row mt20">
              <div className="col-sm-6 col-xl-4">
                <div className="mb20">
                  <label className="heading-color ff-heading fw600 mb10">
                    Latitude
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={hasCoords ? String(value.lat) : ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-sm-6 col-xl-4">
                <div className="mb20">
                  <label className="heading-color ff-heading fw600 mb10">
                    Longitude
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={hasCoords ? String(value.lng) : ""}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LocationField;