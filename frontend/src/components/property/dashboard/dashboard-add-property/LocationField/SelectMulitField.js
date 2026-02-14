"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";

const options = {
  countries: [
    "Belgium",
    "France",
    "Kuwait",
    "Qatar",
    "Netherlands",
    "Germany",
    "Turkey",
    "UK",
    "USA",
  ],
  cities: [
    "California",
    "Chicago",
    "Los Angeles",
    "Manhattan",
    "New Jersey",
    "New York",
    "San Diego",
    "San Francisco",
    "Texas",
  ],
  additionalCountries: [
    "Belgium",
    "France",
    "Kuwait",
    "Qatar",
    "Netherlands",
    "Germany",
    "Turkey",
    "UK",
    "USA",
  ],
};

const customStyles = {
  option: (styles, { isFocused, isSelected, isHovered }) => ({
    ...styles,
    backgroundColor: isSelected
      ? "#eb6753"
      : isHovered
      ? "#eb675312"
      : isFocused
      ? "#eb675312"
      : undefined,
  }),
};

const toSelectOptions = (arr) =>
  arr.map((item) => ({ value: item, label: item }));

const fieldTitles = ["Country / State", "City", "Country"];
const fieldKeys = ["countries", "cities", "additionalCountries"];

const SelectMulitField = ({ value, onChange }) => {
  const [showSelect, setShowSelect] = useState(false);

  // keep these only for UI (not needed for backend)
  const [countryState, setCountryState] = useState([]);
  const [country2, setCountry2] = useState([]);

  useEffect(() => setShowSelect(true), []);

  const cityOptions = toSelectOptions(options.cities);
  const selectedCity = cityOptions.find((o) => o.value === value) || null;

  return (
    <>
      {fieldKeys.map((key, index) => {
        const isCity = key === "cities";

        return (
          <div className="col-sm-6 col-xl-4" key={key}>
            <div className="mb20">
              <label className="heading-color ff-heading fw600 mb10">
                {fieldTitles[index]}
              </label>

              <div className="location-area">
                {showSelect && isCity && (
                  <Select
                    styles={customStyles}
                    className="select-custom pl-0"
                    classNamePrefix="select"
                    // ✅ single select for city
                    isMulti={false}
                    options={cityOptions}
                    value={selectedCity}
                    onChange={(opt) => onChange(opt ? opt.value : "")}
                  />
                )}

                {showSelect && !isCity && (
                  <Select
                    styles={customStyles}
                    className="select-custom pl-0"
                    classNamePrefix="select"
                    // keep original behavior for other 2
                    isMulti
                    options={toSelectOptions(options[key])}
                    value={key === "countries" ? countryState : country2}
                    onChange={(opt) => {
                      if (key === "countries") setCountryState(opt || []);
                      else setCountry2(opt || []);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default SelectMulitField;
