"use client";

import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Image from "next/image";
import React, { useMemo } from "react";

const FALLBACK_IMG = "/images/listings/property-detail-pic.jpg";

const toUrl = (x) => {
  if (!x) return "";
  if (typeof x === "string") return x;
  if (typeof x === "object") return x.url || x.src || "";
  return "";
};

const buildImages = (property) => {
  const cover = toUrl(property?.media?.cover) || FALLBACK_IMG;

  const galleryRaw = Array.isArray(property?.media?.gallery)
    ? property.media.gallery
    : [];

  const gallery = galleryRaw
    .map(toUrl)
    .filter(Boolean)
    .filter((u) => u !== cover);

  // Make sure we always have at least 2 small thumbs (UI)
  const thumbs = gallery.length ? gallery : [cover, cover];

  return { cover, thumbs };
};

const PropertyGallery = ({ id, property }) => {
  const { cover, thumbs } = useMemo(() => buildImages(property), [property]);

  return (
    <Gallery>
      <div className="col-sm-9">
        <div className="sp-img-content mb15-md">
          <div className="popup-img preview-img-1 sp-img">
            <Item original={cover} thumbnail={cover} width={890} height={510}>
              {({ ref, open }) => (
                <Image
                  src={cover}
                  width={890}
                  height={510}
                  ref={ref}
                  onClick={open}
                  alt="property cover"
                  role="button"
                  className="w-100 h-100 cover"
                  // helps if you use remote images and haven't configured next/image domains yet
                  unoptimized
                />
              )}
            </Item>
          </div>
        </div>
      </div>

      <div className="col-sm-3">
        <div className="row">
          {thumbs.slice(0, 2).map((src, index) => (
            <div className="col-sm-12 ps-lg-0" key={`${src}-${index}`}>
              <div className="sp-img-content">
                <div className={`popup-img preview-img-${index + 2} sp-img mb10`}>
                  <Item original={src} thumbnail={src} width={270} height={250}>
                    {({ ref, open }) => (
                      <Image
                        width={270}
                        height={250}
                        className="w-100 h-100 cover"
                        ref={ref}
                        onClick={open}
                        role="button"
                        src={src}
                        alt={`property image ${index + 1}`}
                        unoptimized
                      />
                    )}
                  </Item>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Gallery>
  );
};

export default PropertyGallery;
