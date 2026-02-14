"use client";
import { useEffect, useState } from "react";
import Select from "react-select";

const PropertyDescription = ({
  value,
  onChange,
  errors = {},
  touched = false,
}) => {
  const catergoryOptions = [
    { value: "Apartments", label: "Apartments" },
    { value: "Houses", label: "Houses" },
    { value: "Office", label: "Office" },
    { value: "Villa", label: "Villa" },
  ];

  const businessOptions = [
    { value: "housing society", label: "Housing society" },
    { value: "housing construction", label: "Housing construction" },
    { value: "home solution", label: "Home solution" },
  ];

  const listedIn = [
    { value: "All Listing", label: "All Listing" },
    { value: "Active", label: "Active" },
    { value: "Sold", label: "Sold" },
    { value: "Processing", label: "Processing" },
  ];

  const PropertyStatus = [
    { value: "Active", label: "Active" },
    { value: "Pending", label: "Pending" },
    { value: "Sold", label: "Sold" },
    { value: "Rented", label: "Rented" },
    { value: "Draft", label: "Draft" },
    { value: "Archived", label: "Archived" },
  ];

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

  const [showSelect, setShowSelect] = useState(false);

  useEffect(() => {
    setShowSelect(true);
  }, []);

  return (
    <form className="form-style1">
      <div className="row">
        {/* Title */}
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Property title"
              value={value.title ?? ""}
              onChange={(e) => onChange({ title: e.target.value })}
            />
            {touched && errors.title && (
              <p style={{ color: "red", marginTop: 6 }}>{errors.title}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="col-sm-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Description
            </label>
            <textarea
              cols={30}
              rows={5}
              placeholder="Property description"
              value={value.description ?? ""}
              onChange={(e) => onChange({ description: e.target.value })}
            />
            {touched && errors.description && (
              <p style={{ color: "red", marginTop: 6 }}>
                {errors.description}
              </p>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Select Category
            </label>
            {showSelect && (
              <Select
                value={
                  catergoryOptions.find(
                    (o) => o.value === value.propertyType
                  ) ?? null
                }
                options={catergoryOptions}
                styles={customStyles}
                className="select-custom pl-0"
                classNamePrefix="select"
                isMulti={false}
                onChange={(opt) =>
                  onChange({ propertyType: opt ? opt.value : "" })
                }
              />
            )}
            {touched && errors.propertyType && (
              <p style={{ color: "red", marginTop: 6 }}>
                {errors.propertyType}
              </p>
            )}
          </div>
        </div>

        {/* Listed In (multi stays multi) */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Listed in
            </label>
            {showSelect && (
              <Select
                options={listedIn}
                styles={customStyles}
                className="select-custom pl-0"
                classNamePrefix="select"
                isMulti
              />
            )}
          </div>
        </div>

        {/* Property Status – SINGLE */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Property Status
            </label>
            {showSelect && (
              <Select
                value={
                  PropertyStatus.find(
                    (o) => o.value === value.propertyStatus
                  ) ?? null
                }
                options={PropertyStatus}
                styles={customStyles}
                className="select-custom pl-0"
                classNamePrefix="select"
                isMulti={false}
                onChange={(opt) =>
                  onChange({ propertyStatus: opt ? opt.value : "" })
                }
              />
            )}
            {touched && errors.propertyStatus && (
              <p style={{ color: "red", marginTop: 6 }}>
                {errors.propertyStatus}
              </p>
            )}
          </div>
        </div>

        {/* Business Type – SINGLE */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Business type
            </label>
            {showSelect && (
              <Select
                value={
                  businessOptions.find(
                    (o) => o.value === value.businessType
                  ) ?? null
                }
                options={businessOptions}
                styles={customStyles}
                className="select-custom pl-0"
                classNamePrefix="select"
                isMulti={false}
                onChange={(opt) =>
                  onChange({ businessType: opt ? opt.value : "" })
                }
              />
            )}
            {touched && errors.businessType && (
              <p style={{ color: "red", marginTop: 6 }}>
                {errors.businessType}
              </p>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb30">
            <label className="heading-color ff-heading fw600 mb10">
              Price in $
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="Price"
              value={value.price ?? ""}
              onChange={(e) =>
                onChange({ price: Number(e.target.value) || 0 })
              }
            />
            {touched && errors.price && (
              <p style={{ color: "red", marginTop: 6 }}>
                {errors.price}
              </p>
            )}
          </div>
        </div>

        {/* Yearly Tax */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb30">
            <label className="heading-color ff-heading fw600 mb10">
              Yearly Tax Rate
            </label>
            <input type="text" className="form-control" />
          </div>
        </div>

        {/* After Price Label */}
        <div className="col-sm-6 col-xl-4">
          <div className="mb30">
            <label className="heading-color ff-heading fw600 mb10">
              After Price Label
            </label>
            <input type="text" className="form-control" />
          </div>
        </div>
      </div>
    </form>
  );
};

export default PropertyDescription;
