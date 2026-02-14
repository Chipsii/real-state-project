"use client";
import Select from "react-select";
import PriceRange from "./PriceRange";
import Bedroom from "./Bedroom";
import Bathroom from "./Bathroom";
import Amenities from "./Amenities";
import { useEffect, useMemo, useState } from "react";

const AdvanceFilterModal = ({ filterFunctions }) => {
  const [showSelect, setShowSelect] = useState(false);
  useEffect(() => setShowSelect(true), []);

  const catOptions = useMemo(
    () => [
      { value: "Houses", label: "Houses" },
      { value: "Office", label: "Office" },
      { value: "Apartments", label: "Apartments" },
      { value: "Villa", label: "Villa" },
    ],
    []
  );

  const locationOptions = useMemo(
    () => [
      { value: "All Cities", label: "All Cities" },
      { value: "Dhaka", label: "Dhaka" },
    ],
    []
  );

  const customStyles = {
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected ? "#eb6753" : isFocused ? "#eb675312" : undefined,
    }),
  };

  // ---- controlled select values from state ----
  const selectedTypeValue = useMemo(() => {
    const v = Array.isArray(filterFunctions?.propertyTypes) && filterFunctions.propertyTypes.length
      ? filterFunctions.propertyTypes[0]
      : "All";
    if (v === "All") return null;
    return catOptions.find((o) => o.value === v) ?? null;
  }, [filterFunctions?.propertyTypes, catOptions]);

  const selectedLocationValue = useMemo(() => {
    const v = filterFunctions?.location ?? "All Cities";
    return locationOptions.find((o) => o.value === v) ?? locationOptions[0];
  }, [filterFunctions?.location, locationOptions]);

  return (
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header pl30 pr30">
          <h5 className="modal-title" id="exampleModalLabel">
            More Filter
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>

        <div className="modal-body pb-0">
          {/* Price */}
          <div className="row">
            <div className="col-lg-12">
              <div className="widget-wrapper">
                <h6 className="list-title mb20">Price Range</h6>
                <div className="range-slider-style modal-version">
                  <PriceRange filterFunctions={filterFunctions} />
                </div>
              </div>
            </div>
          </div>

          {/* Type + Property ID (Property ID currently does nothing) */}
          <div className="row">
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Type</h6>
                <div className="form-style2 input-group">
                  {showSelect && (
                    <Select
                      isClearable
                      placeholder="Any type"
                      options={catOptions}
                      styles={customStyles}
                      className="select-custom"
                      classNamePrefix="select"
                      value={selectedTypeValue}
                      onChange={(opt) => {
                        // opt null means cleared -> All
                        if (!opt) filterFunctions?.setPropertyTypes([]);
                        else filterFunctions?.setPropertyTypes([opt.value]);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Property ID</h6>
                <div className="form-style2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="(optional)"
                    // if you want it to work, you need to add state + send to API
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Beds/Baths */}
          <div className="row">
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Bedrooms</h6>
                <div className="d-flex">
                  <Bedroom filterFunctions={filterFunctions} />
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Bathrooms</h6>
                <div className="d-flex">
                  <Bathroom filterFunctions={filterFunctions} />
                </div>
              </div>
            </div>
          </div>

          {/* Location + Sqft */}
          <div className="row">
            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Location</h6>
                <div className="form-style2 input-group">
                  {showSelect && (
                    <Select
                      options={locationOptions}
                      styles={customStyles}
                      className="select-custom filterSelect"
                      classNamePrefix="select"
                      value={selectedLocationValue}
                      onChange={(opt) => filterFunctions?.handlelocation(opt?.value ?? "All Cities")}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="widget-wrapper">
                <h6 className="list-title">Square Feet</h6>
                <div className="space-area">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="form-style1">
                      <input
                        type="number"
                        className="form-control filterInput"
                        placeholder="Min."
                        id="minFeet3"
                        onChange={(e) =>
                          filterFunctions?.handlesquirefeet([
                            Number(e.target.value || 0),
                            Number(document.getElementById("maxFeet3")?.value || 0),
                          ])
                        }
                      />
                    </div>
                    <span className="dark-color">-</span>
                    <div className="form-style1">
                      <input
                        type="number"
                        className="form-control filterInput"
                        placeholder="Max"
                        id="maxFeet3"
                        onChange={(e) =>
                          filterFunctions?.handlesquirefeet([
                            Number(document.getElementById("minFeet3")?.value || 0),
                            Number(e.target.value || 0),
                          ])
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="row">
            <div className="col-lg-12">
              <div className="widget-wrapper mb0">
                <h6 className="list-title mb10">Amenities</h6>
              </div>
            </div>
            <Amenities filterFunctions={filterFunctions} />
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer justify-content-between">
          <button
            type="button"
            className="reset-button"
            onClick={() => filterFunctions?.resetFilter()}
          >
            <span className="flaticon-turn-back" />
            <u>Reset all filters</u>
          </button>

          {/* This button can just close the modal.
              Filtering already happens automatically because your apiQuery useEffect runs */}
          <div className="btn-area">
            <button
              type="button"
              className="ud-btn btn-thm"
              data-bs-dismiss="modal"
            >
              <span className="flaticon-search align-text-top pr10" />
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvanceFilterModal;
