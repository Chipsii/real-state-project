"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import TopFilterBar from "./TopFilterBar";
import TopFilterBar2 from "./TopFilterBar2";
import FeaturedListings from "./FeatuerdListings";
import PaginationTwo from "../../PaginationTwo";
import ListingMap1 from "../ListingMap1";

import { getListings } from "@/services/listing/listings.service";
import AdvanceFilterModal from "@/components/common/advance-filter";

const formatPriceString = (price, currency = "USD") => {
  const num = Number(price ?? 0);
  try {
    const nf = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    return nf.format(num);
  } catch {
    return `$${num}`;
  }
};

const adaptListing = (l) => {
  const coords = Array.isArray(l?.geo?.coordinates) ? l.geo.coordinates : null;
  const lng = coords?.[0] ?? null;
  const lat = coords?.[1] ?? null;

  const priceNumber = Number(l?.price ?? 0);

  return {
    ...l,
    bed: Number(l?.beds ?? 0),
    bath: Number(l?.baths ?? 0),

    beds: Number(l?.beds ?? 0),
    baths: Number(l?.baths ?? 0),
    sqft: Number(l?.sqft ?? 0),

    city: l?.city ?? "",
    location: l?.locationText ?? l?.city ?? "",

    price: formatPriceString(priceNumber, l?.currency ?? "USD"),
    priceNumber,

    propertyType: l?.propertyType ?? "Houses",
    yearBuilding: Number(l?.yearBuilding ?? 0),

    features: Array.isArray(l?.features) ? l.features : [],

    lat,
    lng,
  };
};

export default function PropertyFilteringTwo({ filters = {} }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [items, setItems] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortedFilteredData, setSortedFilteredData] = useState([]);

  const [currentSortingOption, setCurrentSortingOption] = useState("Newest");

  const [pageNumber, setPageNumber] = useState(1);
  const [colstyle, setColstyle] = useState(true);
  const [pageItems, setPageItems] = useState([]);
  const [pageContentTrac, setPageContentTrac] = useState([1, 4, 0]);

  const [listingStatus, setListingStatus] = useState("All"); // All | Buy | Rent
  const [propertyTypes, setPropertyTypes] = useState([]); // array (UI can select multi)
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathroms, setBathroms] = useState(0);
  const [location, setLocation] = useState("All Cities");
  const [squirefeet, setSquirefeet] = useState([]); // [min,max]
  const [yearBuild, setyearBuild] = useState([0, 2050]);
  const [categories, setCategories] = useState([]); // maps to API "features"
  const [searchQuery, setSearchQuery] = useState(""); // client-side text search

  const searchTimer = useRef(null);

  // ---- scroll fixes ----
  const listTopRef = useRef(null);
  const scrollYRef = useRef(0);

  const saveScroll = () => {
    scrollYRef.current = window.scrollY || 0;
  };

  const restoreScroll = () => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollYRef.current, behavior: "auto" });
    });
  };

  const scrollToListTop = () => {
    requestAnimationFrame(() => {
      listTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  useEffect(() => {
    if (typeof filters.q === "string") setSearchQuery(filters.q);

    if (filters.forRent === "true") setListingStatus("Rent");
    else if (filters.forRent === "false") setListingStatus("Buy");
    else setListingStatus("All");

    if (typeof filters.city === "string" && filters.city.trim())
      setLocation(filters.city);
    else setLocation("All Cities");

    if (typeof filters.propertyType === "string" && filters.propertyType.trim())
      setPropertyTypes([filters.propertyType]);
    else setPropertyTypes([]);

    const minP = Number(filters.minPrice ?? 0);
    const maxP = Number(filters.maxPrice ?? 100000);
    if (Number.isFinite(minP) && Number.isFinite(maxP))
      setPriceRange([minP, maxP]);

    const mb = Number(filters.minBeds ?? 0);
    const mba = Number(filters.minBaths ?? 0);
    if (Number.isFinite(mb)) setBedrooms(mb);
    if (Number.isFinite(mba)) setBathroms(mba);

    const minS = filters.minSqft != null ? Number(filters.minSqft) : null;
    const maxS = filters.maxSqft != null ? Number(filters.maxSqft) : null;
    if (Number.isFinite(minS) || Number.isFinite(maxS)) {
      setSquirefeet([
        Number.isFinite(minS) ? minS : 0,
        Number.isFinite(maxS) ? maxS : 999999,
      ]);
    } else {
      setSquirefeet([]);
    }

    if (typeof filters.features === "string" && filters.features.trim()) {
      const f = filters.features
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      setCategories(f);
    } else {
      setCategories([]);
    }

    setPageNumber(1);
  }, [filters]);

  const resetFilter = () => {
    saveScroll();

    setListingStatus("All");
    setPropertyTypes([]);
    setPriceRange([0, 100000]);
    setBedrooms(0);
    setBathroms(0);
    setLocation("All Cities");
    setSquirefeet([]);
    setyearBuild([0, 2050]);
    setCategories([]);
    setCurrentSortingOption("Newest");
    setSearchQuery("");

    document
      .querySelectorAll(".filterInput")
      .forEach((el) => (el.value = null));
    document
      .querySelectorAll(".filterSelect")
      .forEach((el) => (el.value = "All Cities"));

    setTimeout(restoreScroll, 0);
  };

  const handlelistingStatus = (elm) =>
    setListingStatus((pre) => (pre === elm ? "All" : elm));

  const handlepropertyTypes = (elm) => {
    if (elm === "All") setPropertyTypes([]);
    else
      setPropertyTypes((pre) =>
        pre.includes(elm) ? pre.filter((x) => x !== elm) : [...pre, elm],
      );
  };

  const handlepriceRange = (elm) => setPriceRange(elm);
  const handlebedrooms = (elm) => setBedrooms(elm);
  const handlebathroms = (elm) => setBathroms(elm);
  const handlelocation = (elm) => setLocation(elm);
  const handlesquirefeet = (elm) => setSquirefeet(elm);
  const handleyearBuild = (elm) => setyearBuild(elm);

  const handlecategories = (elm) => {
    if (elm === "All") setCategories([]);
    else
      setCategories((pre) =>
        pre.includes(elm) ? pre.filter((x) => x !== elm) : [...pre, elm],
      );
  };

  const filterFunctions = useMemo(
    () => ({
      handlelistingStatus,
      handlepropertyTypes,
      handlepriceRange,
      handlebedrooms,
      handlebathroms,
      handlelocation,
      handlesquirefeet,
      handleyearBuild,
      handlecategories,

      priceRange,
      listingStatus,
      propertyTypes,
      resetFilter,

      bedrooms,
      bathroms,
      location,
      squirefeet,
      yearBuild,
      categories,
      setPropertyTypes,
      setSearchQuery,
    }),
    [
      priceRange,
      listingStatus,
      propertyTypes,
      bedrooms,
      bathroms,
      location,
      squirefeet,
      yearBuild,
      categories,
    ],
  );

  const apiQuery = useMemo(() => {
    const q = {};

    if (listingStatus === "Buy") q.forRent = "false";
    if (listingStatus === "Rent") q.forRent = "true";

    if (location && location !== "All Cities") q.city = location;

    if (Array.isArray(propertyTypes) && propertyTypes.length === 1) {
      q.propertyType = propertyTypes[0];
    }

    if (Array.isArray(priceRange) && priceRange.length === 2) {
      q.minPrice = String(priceRange[0] ?? 0);
      q.maxPrice = String(priceRange[1] ?? 0);
    }

    if (Number(bedrooms) > 0) q.minBeds = String(bedrooms);
    if (Number(bathroms) > 0) q.minBaths = String(bathroms);

    if (Array.isArray(squirefeet) && squirefeet.length === 2) {
      const [minSqft, maxSqft] = squirefeet;
      if (Number(minSqft) > 0) q.minSqft = String(minSqft);
      if (Number(maxSqft) > 0) q.maxSqft = String(maxSqft);
    }

    if (Array.isArray(categories) && categories.length) {
      q.features = categories.join(",");
    }

    if (currentSortingOption === "Newest") {
      q.sort = "createdAt";
      q.order = "desc";
    } else if (currentSortingOption.trim() === "Price Low") {
      q.sort = "price";
      q.order = "asc";
    } else if (currentSortingOption.trim() === "Price High") {
      q.sort = "price";
      q.order = "desc";
    }

    q.limit = "500";
    q.page = "1";

    return q;
  }, [
    listingStatus,
    location,
    propertyTypes,
    priceRange,
    bedrooms,
    bathroms,
    squirefeet,
    categories,
    currentSortingOption,
  ]);

  const fetchListings = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getListings(apiQuery);

      const rawItems = res?.data?.items || res?.items || [];
      const adapted = rawItems.map(adaptListing);

      setItems(adapted);
    } catch (e) {
      console.error(e);
      setError("Failed to load properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    saveScroll();
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchListings();
      setTimeout(restoreScroll, 0);
    }, 250);

    return () => clearTimeout(searchTimer.current);
  }, [apiQuery]);

  useEffect(() => {
    let data = [...items];

    if (Array.isArray(propertyTypes) && propertyTypes.length > 1) {
      data = data.filter((x) => propertyTypes.includes(x.propertyType));
    }

    const q = String(searchQuery || "").toLowerCase();
    if (q) {
      data = data.filter((el) => {
        const hay =
          `${el.city} ${el.location} ${el.title} ${(el.features || []).join(" ")}`.toLowerCase();
        return hay.includes(q);
      });
    }

    if (Array.isArray(yearBuild) && yearBuild.length === 2) {
      data = data.filter(
        (x) => x.yearBuilding >= yearBuild[0] && x.yearBuilding <= yearBuild[1],
      );
    }

    setFilteredData(data);
  }, [items, propertyTypes, searchQuery, yearBuild]);

  useEffect(() => {
    saveScroll();
    setPageNumber(1);

    if (currentSortingOption === "Newest") {
      setSortedFilteredData(
        [...filteredData].sort(
          (a, b) =>
            (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
            (a.createdAt ? new Date(a.createdAt).getTime() : 0),
        ),
      );
    } else if (currentSortingOption.trim() === "Price Low") {
      setSortedFilteredData(
        [...filteredData].sort(
          (a, b) => (a.priceNumber ?? 0) - (b.priceNumber ?? 0),
        ),
      );
    } else if (currentSortingOption.trim() === "Price High") {
      setSortedFilteredData(
        [...filteredData].sort(
          (a, b) => (b.priceNumber ?? 0) - (a.priceNumber ?? 0),
        ),
      );
    } else {
      setSortedFilteredData(filteredData);
    }

    setTimeout(restoreScroll, 0);
  }, [filteredData, currentSortingOption]);

  useEffect(() => {
    setPageItems(
      sortedFilteredData.slice((pageNumber - 1) * 4, pageNumber * 4),
    );
    setPageContentTrac([
      (pageNumber - 1) * 4 + 1,
      pageNumber * 4,
      sortedFilteredData.length,
    ]);
  }, [pageNumber, sortedFilteredData]);

  return (
    <>
      <div className="advance-feature-modal">
        <div
          className="modal fade"
          id="advanceSeachModal"
          tabIndex={-1}
          aria-labelledby="advanceSeachModalLabel"
          aria-hidden="true"
        >
          <AdvanceFilterModal />
        </div>
      </div>

      <section className="p-0 bgc-f7">
        <div className="container-fluid">
          <div className="row" data-aos="fade-up" data-aos-duration="200">
            <div className="col-xl-5">
              <div className="half_map_area_content mt30">
                <div className="col-lg-12">
                  <div className="advance-search-list d-flex justify-content-between">
                    <div className="dropdown-lists">
                      <ul className="p-0 mb-0">
                        <TopFilterBar2 filterFunctions={filterFunctions} />
                      </ul>
                      <div className="advance-feature-modal">
                        <div
                          className="modal fade"
                          id="advanceSeachModal"
                          tabIndex={-1}
                          aria-labelledby="advanceSeachModalLabel"
                          aria-hidden="true"
                        >
                          <AdvanceFilterModal
                            filterFunctions={filterFunctions}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h4 className="mb-1">Properties</h4>

                <div className="row align-items-center mb10">
                  <TopFilterBar
                    pageContentTrac={pageContentTrac}
                    colstyle={colstyle}
                    setColstyle={setColstyle}
                    setCurrentSortingOption={setCurrentSortingOption}
                  />
                </div>

                <div ref={listTopRef} />

                {loading ? (
                  <div style={{ minHeight: 600 }} className="p-3">
                    Loading properties…
                  </div>
                ) : error ? (
                  <div style={{ minHeight: 600 }} className="p-3">
                    <div className="mb-2 text-danger">{error}</div>
                    <button
                      className="ud-btn btn-theme"
                      type="button"
                      onClick={fetchListings}
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="row">
                      <FeaturedListings colstyle={colstyle} data={pageItems} />
                    </div>

                    <div className="row text-center">
                      <PaginationTwo
                        pageCapacity={4}
                        data={sortedFilteredData}
                        pageNumber={pageNumber}
                        setPageNumber={(p) => {
                          setPageNumber(p);
                          scrollToListTop();
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="col-xl-7 overflow-hidden position-relative">
              <div className="half_map_area map-canvas half_style">
                <ListingMap1 data={sortedFilteredData} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
