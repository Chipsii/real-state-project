import React, { useEffect, useMemo } from "react";

const amenitiesData = {
  column1: [
    { label: "Attic", defaultChecked: false },
    { label: "Basketball court", defaultChecked: true },
    { label: "Air Conditioning", defaultChecked: true },
    { label: "Lawn", defaultChecked: true },
    { label: "Swimming Pool", defaultChecked: false },
    { label: "Barbeque", defaultChecked: false },
    { label: "Microwave", defaultChecked: false },
  ],
  column2: [
    { label: "TV Cable", defaultChecked: false },
    { label: "Dryer", defaultChecked: true },
    { label: "Outdoor Shower", defaultChecked: true },
    { label: "Washer", defaultChecked: true },
    { label: "Gym", defaultChecked: false },
    { label: "Ocean view", defaultChecked: false },
    { label: "Private space", defaultChecked: false },
  ],
  column3: [
    { label: "Lake view", defaultChecked: false },
    { label: "Wine cellar", defaultChecked: true },
    { label: "Front yard", defaultChecked: true },
    { label: "Refrigerator", defaultChecked: true },
    { label: "WiFi", defaultChecked: false },
    { label: "Laundry", defaultChecked: false },
    { label: "Sauna", defaultChecked: false },
  ],
};

const flattenAmenities = (data) =>
  Object.values(data).flat().map((a) => a.label);

const Amenities = ({ value, onChange, errors = {}, touched = false, disabled = false }) => {
  const allAmenityLabels = useMemo(() => flattenAmenities(amenitiesData), []);

  const features = Array.isArray(value?.features) ? value.features : [];
  const tags = Array.isArray(value?.tags) ? value.tags : [];

  // Optional: apply defaults only if creating and features are empty
  useEffect(() => {
    if (features.length) return;

    const defaults = allAmenityLabels.filter((label) => {
      const item = Object.values(amenitiesData).flat().find((x) => x.label === label);
      return Boolean(item?.defaultChecked);
    });

    if (defaults.length) {
      onChange?.({ features: defaults });
    }
  }, [allAmenityLabels]);

  const toggleFeature = (label) => {
    const set = new Set(features);
    if (set.has(label)) set.delete(label);
    else set.add(label);

    onChange?.({ features: Array.from(set) });
  };

  const isChecked = (label) => features.includes(label);

  // Simple comma-separated tags input (optional)
  const handleTagsChange = (e) => {
    const next = e.target.value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    onChange?.({ tags: next });
  };

  return (
    <div className="row">
      {Object.keys(amenitiesData).map((columnKey, index) => (
        <div key={columnKey} className="col-sm-6 col-lg-3 col-xxl-2">
          <div className="checkbox-style1">
            {amenitiesData[columnKey].map((amenity) => (
              <label key={amenity.label} className="custom_checkbox">
                {amenity.label}
                <input
                  type="checkbox"
                  checked={isChecked(amenity.label)}
                  onChange={() => toggleFeature(amenity.label)}
                  disabled={disabled}
                />
                <span className="checkmark" />
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Optional tags */}
      <div className="col-12 mt-3">
        <label className="form-label fw600">Tags (comma separated)</label>
        <input
          type="text"
          className="form-control"
          value={tags.join(", ")}
          onChange={handleTagsChange}
          disabled={disabled}
          placeholder="e.g. family, city-center, renovated"
        />
        {touched && errors?.tags && (
          <div className="text-danger mt-1" style={{ fontSize: 13 }}>
            {errors.tags}
          </div>
        )}
      </div>

      {touched && errors?.features && (
        <div className="col-12">
          <div className="text-danger mt-2" style={{ fontSize: 13 }}>
            {errors.features}
          </div>
        </div>
      )}
    </div>
  );
};

export default Amenities;
