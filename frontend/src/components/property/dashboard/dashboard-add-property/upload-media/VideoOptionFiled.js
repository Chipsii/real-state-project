"use client";
import { useEffect, useState } from "react";
import Select from "react-select";

const videoField = [
  { value: "youtube", label: "Youtube" },
  { value: "facebook", label: "Facebook" },
  { value: "vimeo", label: "Vimeo" },
];

const customStyles = {
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected ? "#eb6753" : isFocused ? "#eb675312" : undefined,
  }),
};



const VideoOptionFiled = ({
  value,
  onChange,
}) => {
  const [showSelect, setShowSelect] = useState(false);

  useEffect(() => setShowSelect(true), []);

  const provider = value?.provider ?? "youtube";
  const url = value?.url ?? "";

  return (
    <>
      <div className="col-sm-6 col-xl-4">
        <div className="mb30">
          <label className="heading-color ff-heading fw600 mb10">
            Video from
          </label>

          <div className="location-area">
            {showSelect && (
              <Select
                value={videoField.find((x) => x.value === provider)}
                options={videoField}
                styles={customStyles}
                className="select-custom pl-0"
                classNamePrefix="select"
                isMulti={false}
                onChange={(opt) => {
                  if (!opt) return onChange(null);
                  onChange({ provider: opt.value, url });
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="col-sm-6 col-xl-8">
        <div className="mb30">
          <label className="heading-color ff-heading fw600 mb10">
            Video link
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => {
              const next = e.target.value;
              if (!next.trim()) return onChange(null);
              onChange({ provider, url: next });
            }}
          />
        </div>
      </div>
    </>
  );
};

export default VideoOptionFiled;
