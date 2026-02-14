"use client";

import { Tooltip as ReactTooltip } from "react-tooltip";
import React, { useState } from "react";
import Image from "next/image";
import { uploadImages } from "@/services/listing/listings.service";

const UploadPhotoGallery = ({ cover, gallery, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files) => {
    const arr = Array.from(files || []);
    if (!arr.length) return;

    setUploading(true);
    try {
      // ✅ ONE request for all files
      const res = await uploadImages(arr);

      // res should be { data: string[] }
      const urls = Array.isArray(res?.data) ? res.data : [];
      console.log(urls)
      const uploaded = urls.map((url, idx) => ({
        url,
        order: idx,
      }));

      const nextCover = cover ?? uploaded[0] ?? null;

      const nextGallery = [...(gallery ?? []), ...uploaded].map((img, i) => ({
        ...img,
        order: i,
      }));

      onChange({ cover: nextCover, gallery: nextGallery });
    } catch (e) {
      console.error(e);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleUpload(event.dataTransfer.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDelete = (index) => {
    const next = [...(gallery ?? [])];
    const removed = next[index];
    next.splice(index, 1);

    const nextCover = cover?.url === removed?.url ? next[0] ?? null : cover;

    onChange({
      cover: nextCover,
      gallery: next.map((img, i) => ({ ...img, order: i })),
    });
  };


  return (
    <>
      <div
        className="upload-img position-relative overflow-hidden bdrs12 text-center mb30 px-2"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="icon mb30">
          <span className="flaticon-upload" />
        </div>
        <h4 className="title fz17 mb10">Upload/Drag photos of your property</h4>
        <p className="text mb25">Photos must be JPEG or PNG format</p>

        <label className="ud-btn btn-white" style={{ cursor: "pointer" }}>
          {uploading ? "Uploading..." : "Browse Files"}
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
            style={{ display: "none" }}
            disabled={uploading}
          />
        </label>
      </div>

      {cover?.url && (
        <div className="mb20">
          <p className="fw600 mb10">Cover</p>
          <Image
            width={320}
            height={200}
            className="w-100 bdrs12 cover"
            src={cover.url}
            alt="Cover"
          />
        </div>
      )}

      <div className="row profile-box position-relative d-md-flex align-items-end mb50">
        {(gallery ?? []).map((img, index) => {
          console.log(img)
          
          return <div className="col-2" key={`${img.url}-${index}`}>
            <div className="profile-img mb20 position-relative">
             <Image
  unoptimized
  width={212}
  height={194}
  className="w-100 bdrs12 cover"
  src={img.url}
  alt={`Uploaded Image ${index + 1}`}
/>

              <button
                style={{ border: "none" }}
                className="tag-del"
                title="Delete Image"
                onClick={() => handleDelete(index)}
                type="button"
                data-tooltip-id={`delete-${index}`}
              >
                <span className="fas fa-trash-can" />
              </button>

              <ReactTooltip
                id={`delete-${index}`}
                place="right"
                content="Delete Image"
              />
            </div>
          </div>
})}
      </div>
    </>
  );
};

export default UploadPhotoGallery;
