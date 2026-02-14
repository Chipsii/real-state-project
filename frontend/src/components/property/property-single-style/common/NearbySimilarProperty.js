"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { getListings } from "@/services/listing/listings.service";

// --- small helpers ---
const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const moneyRange = (price) => {
  const p = toNumber(price);
  if (!p) return { min: 0, max: 0 };
  const min = Math.max(0, Math.floor(p * 0.7));
  const max = Math.ceil(p * 1.3);
  return { min, max };
};

const adaptListing = (l) => {
  const priceNumber = toNumber(l?.price);
  const currency = l?.currency || "USD";

  // You already format price elsewhere, but keep this component safe:
  const priceStr = (() => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(priceNumber);
    } catch {
      return `$${priceNumber}`;
    }
  })();

  return {
    id: l?._id || l?.id,
    title: l?.title || "Untitled",
    image: l?.media?.cover?.url || l?.media?.gallery?.[0]?.url || "/images/listings/default.jpg",
    location: l?.locationText || l?.city || "",
    city: l?.city || "",
    forRent: Boolean(l?.forRent),
    bed: toNumber(l?.beds),
    bath: toNumber(l?.baths),
    sqft: toNumber(l?.sqft),
    price: priceStr,
    priceNumber,
    currency,
  };
};

const NearbySimilarProperty = ({ property }) => {
  console.log("from nearby "+JSON.stringify(property))
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const propertyId = property?._id || property?.id || "";
  const city = property?.city || "";
  const propertyType = property?.propertyType || "";
  const forRent = property?.forRent;

  const basePrice = toNumber(property?.price);
  const { min: minPrice, max: maxPrice } = useMemo(
    () => moneyRange(basePrice),
    [basePrice]
  );

  // Build “similar” query for your API
  const query = useMemo(() => {
    const q = {};

    // Match rent/sale if defined
    if (typeof forRent === "boolean") q.forRent = String(forRent);

    // Match city if available
    if (city) q.city = city;

    // Match property type if available
    if (propertyType) q.propertyType = propertyType;

    // Price band around current listing (only if price exists)
    if (basePrice > 0) {
      q.minPrice = String(minPrice);
      q.maxPrice = String(maxPrice);
    }

    // keep it small; you can increase later
    q.limit = "10";
    q.page = "1";

    // sort newest / relevant
    q.sort = "createdAt";
    q.order = "desc";

    return q;
  }, [forRent, city, propertyType, basePrice, minPrice, maxPrice]);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      if (!propertyId) return;

      setLoading(true);
      try {
        const res = await getListings(query);

        // your response format: { status, message, data: { items } }
        const raw = res?.data?.items || res?.items || [];
        const adapted = raw
          .map(adaptListing)
          .filter((x) => x.id && x.id !== propertyId); // exclude current listing

        if (alive) setItems(adapted);
      } catch (e) {
        console.error("Failed to load similar listings", e);
        if (alive) setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [propertyId, query]);

  if (!propertyId) return null;

  if (loading) {
    return <div className="p-3">Loading similar properties…</div>;
  }

  if (!items.length) {
    return <div className="p-3">No similar properties found.</div>;
  }

  return (
    <Swiper
      spaceBetween={30}
      modules={[Navigation, Pagination]}
      navigation={{
        nextEl: ".featured-next__active",
        prevEl: ".featured-prev__active",
      }}
      pagination={{
        el: ".featured-pagination__active",
        clickable: true,
      }}
      slidesPerView={1}
      breakpoints={{
        300: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
      }}
    >
      {items.slice(0, 8).map((listing) => (
        <SwiperSlide key={listing.id}>
          <div className="item">
            <div className="listing-style1">
              <div className="list-thumb">
                <Image
                  width={382}
                  height={248}
                  className="w-100 h-100 cover"
                  src={listing.image}
                  alt={listing.title}
                  unoptimized
                />

                <div className="sale-sticker-wrap">
                  {!listing.forRent && (
                    <div className="list-tag rounded-0 fz12">
                      <span className="flaticon-electricity" />
                      FEATURED
                    </div>
                  )}
                </div>

                <div className="list-price">
                  {listing.price}
                  {listing.forRent ? (
                    <>
                      {" "}
                      / <span>mo</span>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="list-content">
                <h6 className="list-title">
                  <Link href={`/single-v1/${listing.id}`}>{listing.title}</Link>
                </h6>

                <p className="list-text">{listing.location}</p>

                <div className="list-meta d-flex align-items-center">
                  <span>
                    <span className="flaticon-bed" /> {listing.bed} bed
                  </span>
                  <span>
                    <span className="flaticon-shower" /> {listing.bath} bath
                  </span>
                  <span>
                    <span className="flaticon-expand" /> {listing.sqft} sqft
                  </span>
                </div>

                <hr className="mt-2 mb-2" />

                <div className="list-meta2 d-flex justify-content-between align-items-center">
                  <span className="for-what">
                    {listing.forRent ? "For Rent" : "For Sale"}
                  </span>

                  <div className="icons d-flex align-items-center">
                    <span>
                      <span className="flaticon-fullscreen" />
                    </span>
                    <span>
                      <span className="flaticon-new-tab" />
                    </span>
                    <span>
                      <span className="flaticon-like" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default NearbySimilarProperty;
