'use client'

import React, { useEffect } from "react";

const ListingStatus = ({filterFunctions}) => {
  const option = { id: "flexRadioDefault1", label: "Buy" };

  useEffect(() => {
    if (!filterFunctions?.listingStatus) {
      filterFunctions?.handlelistingStatus?.(option.label);
    }
  }, [filterFunctions?.listingStatus]);

  return (
    <>
      <div className="form-check d-flex align-items-center mb10">
        <input
          className="form-check-input"
          id={option.id}
          type="radio"
          checked={(filterFunctions?.listingStatus ?? option.label) === option.label}
          onChange={() => filterFunctions?.handlelistingStatus(option.label)}
        />
        <label className="form-check-label" htmlFor={option.id}>
          {option.label}
        </label>
      </div>
    </>
  );
};

export default ListingStatus;
