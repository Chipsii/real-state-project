"use client";

import React from "react";
import MultiSelectField from "./MultiSelectField";
import StructureType from "./StructureType";

const DetailsFiled = ({ value, onChange, errors = {}, touched = false }) => {
  return (
    <form className="form-style1">
      <div className="row">
        {/* sqft (API) */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Size in sqft (numbers)
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 1200"
              value={Number.isFinite(Number(value.sqft)) ? value.sqft : ""}
              onChange={(e) => onChange({ sqft: Number(e.target.value) || 0 })}
              min={0}
            />
            {touched && errors.sqft && (
              <p style={{ color: "red", marginTop: 6, marginBottom: 0 }}>
                {errors.sqft}
              </p>
            )}
          </div>
        </div>

        {/* lotSize (UI only - not in schema) */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Lot size
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 3 katha / 5 decimal"
              value={value.lotSize ?? ""}
              onChange={(e) => onChange({ lotSize: e.target.value })}
            />
          </div>
        </div>

        {/* rooms */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Rooms
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 5"
              value={value.rooms ?? ""}
              onChange={(e) => onChange({ rooms: Number(e.target.value) || 0 })}
              min={0}
            />
          </div>
        </div>

        {/* beds (API) */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Bedrooms
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 3"
              value={Number.isFinite(Number(value.beds)) ? value.beds : ""}
              onChange={(e) => onChange({ beds: Number(e.target.value) || 0 })}
              min={0}
            />
            {touched && errors.beds && (
              <p style={{ color: "red", marginTop: 6, marginBottom: 0 }}>
                {errors.beds}
              </p>
            )}
          </div>
        </div>

        {/* baths (API) */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Bathrooms
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 2"
              value={Number.isFinite(Number(value.baths)) ? value.baths : ""}
              onChange={(e) => onChange({ baths: Number(e.target.value) || 0 })}
              min={0}
            />
            {touched && errors.baths && (
              <p style={{ color: "red", marginTop: 6, marginBottom: 0 }}>
                {errors.baths}
              </p>
            )}
          </div>
        </div>

        {/* customId */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Custom ID
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. PROP-102"
              value={value.customId ?? ""}
              onChange={(e) => onChange({ customId: e.target.value })}
            />
          </div>
        </div>

        {/* garages */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Garages
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 1"
              value={value.garages ?? ""}
              onChange={(e) => onChange({ garages: Number(e.target.value) || 0 })}
              min={0}
            />
          </div>
        </div>

        {/* garageSize */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Garage size
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 10x12"
              value={value.garageSize ?? ""}
              onChange={(e) => onChange({ garageSize: e.target.value })}
            />
          </div>
        </div>

        {/* yearBuilding (API) */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Year built
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 2015"
              value={
                Number.isFinite(Number(value.yearBuilding))
                  ? value.yearBuilding
                  : ""
              }
              onChange={(e) =>
                onChange({ yearBuilding: Number(e.target.value) || 0 })
              }
              min={1000}
              max={new Date().getFullYear()}
            />
            {touched && errors.yearBuilding && (
              <p style={{ color: "red", marginTop: 6, marginBottom: 0 }}>
                {errors.yearBuilding}
              </p>
            )}
          </div>
        </div>

        {/* availableFrom - DATE PICKER */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Available from
            </label>
            <input
              type="date"
              className="form-control"
              value={value.availableFrom ?? ""}
              onChange={(e) => onChange({ availableFrom: e.target.value })}
            />
          </div>
        </div>

        {/* Basement */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Basement
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Yes/No"
              value={value.basement ?? ""}
              onChange={(e) => onChange({ basement: e.target.value })}
            />
          </div>
        </div>

        {/* Extra details */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Extra details
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. corner plot, south facing"
              value={value.extraDetails ?? ""}
              onChange={(e) => onChange({ extraDetails: e.target.value })}
            />
          </div>
        </div>

        {/* Roofing */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Roofing
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. RCC"
              value={value.roofing ?? ""}
              onChange={(e) => onChange({ roofing: e.target.value })}
            />
          </div>
        </div>

        {/* Exterior Material */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Exterior Material
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. brick, concrete"
              value={value.exteriorMaterial ?? ""}
              onChange={(e) => onChange({ exteriorMaterial: e.target.value })}
            />
          </div>
        </div>

        {/* Keep your existing component */}
        <StructureType value={value} onChange={onChange} />
      </div>

      <div className="row">
        <MultiSelectField value={value} onChange={onChange} />

        {/* Owner Notes */}
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Owner/Agent notes (UI only — not visible on frontend)
            </label>
            <textarea
              cols={30}
              rows={5}
              placeholder="Internal notes..."
              value={value.ownerNotes ?? ""}
              onChange={(e) => onChange({ ownerNotes: e.target.value })}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default DetailsFiled;
