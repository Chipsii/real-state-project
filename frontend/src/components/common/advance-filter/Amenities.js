"use client";
import React, { useMemo } from "react";

const ALL_AMENITIES = [
  [
    { label: "Air Conditioning" },
    { label: "Heating" },
    { label: "WiFi" },
    { label: "TV Cable" },
    { label: "Electricity Backup" },
    { label: "Gas Line" },
    { label: "Water Supply" },
    { label: "Intercom" },
  ],

  [
    { label: "Refrigerator" },
    { label: "Microwave" },
    { label: "Oven" },
    { label: "Dishwasher" },
    { label: "Washer" },
    { label: "Dryer" },
    { label: "Laundry Room" },
    { label: "Laundry Service" },
  ],

  [
    { label: "Swimming Pool" },
    { label: "Gym" },
    { label: "Sauna" },
    { label: "Spa / Jacuzzi" },
    { label: "Yoga Room" },
    { label: "Community Hall" },
    { label: "Playground" },
    { label: "Garden / Lawn" },
  ],

  [
    { label: "Parking" },
    { label: "Garage" },
    { label: "Visitor Parking" },
    { label: "Elevator / Lift" },
    { label: "Wheelchair Accessible" },
    { label: "Storage Room" },
    { label: "Basement" },
    { label: "Attic" },
  ],

  [
    { label: "Security Guard" },
    { label: "CCTV Surveillance" },
    { label: "Fire Alarm" },
    { label: "Fire Exit" },
    { label: "Smoke Detector" },
    { label: "Gated Community" },
    { label: "Doorman" },
    { label: "Concierge" },
  ],

  [
    { label: "Balcony" },
    { label: "Terrace" },
    { label: "Rooftop Access" },
    { label: "Front Yard" },
    { label: "Backyard" },
    { label: "BBQ Area" },
    { label: "Outdoor Shower" },
    { label: "Private Space" },
  ],

  [
    { label: "Lake View" },
    { label: "Sea View" },
    { label: "City View" },
    { label: "Park View" },
    { label: "Garden View" },
    { label: "Corner Plot" },
    { label: "South Facing" },
    { label: "North Facing" },
  ],

  [
    { label: "Pet Friendly" },
    { label: "Furnished" },
    { label: "Semi-Furnished" },
    { label: "Unfurnished" },
    { label: "Serviced Apartment" },
    { label: "Smart Home Features" },
    { label: "Solar Panels" },
    { label: "EV Charging" },
  ],
];

const Amenities = ({ value = [], onChange }) => {
  const selected = useMemo(
    () => (Array.isArray(value) ? value : []),
    [value]
  );

  const toggleAmenity = (label) => {
    const next = selected.includes(label)
      ? selected.filter((x) => x !== label)
      : [...selected, label];

    onChange?.(next);
  };

  return (
    <>
      {ALL_AMENITIES.map((column, columnIndex) => (
        <div className="col-sm-4 col-md-3" key={columnIndex}>
          <div className="widget-wrapper mb20">
            <div className="checkbox-style1">
              {column.map((amenity, amenityIndex) => {
                const checked = selected.includes(amenity.label);

                return (
                  <label className="custom_checkbox" key={amenityIndex}>
                    {amenity.label}
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAmenity(amenity.label)}
                    />
                    <span className="checkmark" />
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Amenities;
