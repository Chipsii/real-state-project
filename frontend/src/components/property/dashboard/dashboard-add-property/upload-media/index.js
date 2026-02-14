"use client";

import React from "react";
import UploadPhotoGallery from "./UploadPhotoGallery";
import VideoOptionFiled from "./VideoOptionFiled";


const UploadMedia = ({
  media,
  onChange,
}) => {
  return (
    <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
      <h4 className="title fz17 mb30">Upload photos of your property</h4>

      <form className="form-style1" onSubmit={(e) => e.preventDefault()}>
        <div className="row">
          <div className="col-lg-12">
            <UploadPhotoGallery
              cover={media.cover}
              gallery={media.gallery}
              onChange={(patch) => onChange(patch)}
            />
          </div>
        </div>

        <div className="row mt30">
          <h4 className="title fz17 mb30">Video Option</h4>
          <VideoOptionFiled
            value={media.video}
            onChange={(video) => onChange({ video })}
          />
        </div>

        <div className="row mt30">
          <h4 className="title fz17 mb30">Virtual Tour</h4>
          <div className="col-sm-6 col-xl-12">
            <div className="mb30">
              <label className="heading-color ff-heading fw600 mb10">
                Virtual Tour
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Virtual Tour link"
                value={media.virtualTourUrl ?? ""}
                onChange={(e) => onChange({ virtualTourUrl: e.target.value })}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadMedia;
