"use client";

import React, { useEffect, useRef, useState } from "react";

import DashboardHeader from "@/components/common/DashboardHeader";
import MobileMenu from "@/components/common/mobile-menu";
import Footer from "@/components/property/dashboard/Footer";
import SidebarDashboard from "@/components/property/dashboard/SidebarDashboard";
import DboardMobileNavigation from "@/components/property/dashboard/DboardMobileNavigation";

import FilterHeader from "../../../../components/property/dashboard/dashboard-my-properties/FilterHeader";
import PropertyDataTable from "@/components/property/dashboard/dashboard-my-properties/PropertyDataTable";
import Pagination from "@/components/property/Pagination";

import { getListings } from "@/services/listing/listings.service";

const DashboardProperties = () => {
  const [loading, setLoading] = useState(false);

  // backend response shape: { page, limit, total, totalPages, items }
  const [data, setData] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    items: [],
  });

  // Filters that match your FilterHeader UI
  const [filters, setFilters] = useState({
    search: "",
    sort: "createdAt_desc", // createdAt_desc | price_asc | price_desc ...
  });

  const searchTimer = useRef(null);

  const parseSort = (sortValue) => {
    let sort = "createdAt";
    let order = "desc";

    if (sortValue && String(sortValue).includes("_")) {
      const [f, o] = String(sortValue).split("_");
      sort = f || "createdAt";
      order = o === "asc" ? "asc" : "desc";
    }

    const allowed = ["price", "sqft", "yearBuilding", "createdAt"];
    if (!allowed.includes(sort)) sort = "createdAt";

    return { sort, order };
  };

  const fetchListings = async (patch = {}) => {
    const nextPage = patch.page ?? data.page ?? 1;
    const nextLimit = patch.limit ?? data.limit ?? 10;
    const nextSearch = patch.search ?? filters.search;
    const nextSortValue = patch.sort ?? filters.sort;

    const { sort, order } = parseSort(nextSortValue);

    setLoading(true);
    try {
      const res = await getListings({
        page: nextPage,
        limit: nextLimit,
        sort,
        order,
        search: nextSearch,
      });

      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings({ page: 1 });
  }, []);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchListings({ page: 1 });
    }, 350);

    return () => clearTimeout(searchTimer.current);
  }, [filters.search]);

  useEffect(() => {
    fetchListings({ page: 1 });
  }, [filters.sort]);

  return (
    <>
      <DashboardHeader />
      <MobileMenu />

      <div className="dashboard_content_wrapper">
        <div className="dashboard dashboard_wrapper pr30 pr0-xl">
          <SidebarDashboard />

          <div className="dashboard__main pl0-md">
            <div className="dashboard__content bgc-f7">
              <div className="row pb40">
                <div className="col-lg-12">
                  <DboardMobileNavigation />
                </div>
              </div>

              <div className="row align-items-center pb40">
                <div className="col-xxl-3">
                  <div className="dashboard_title_area">
                    <h2>My Properties</h2>
                    <p className="text">We are glad to see you again!</p>
                  </div>
                </div>

                <div className="col-xxl-9">
                  <FilterHeader
                    value={filters}
                    loading={loading}
                    onChange={(patch) => setFilters((p) => ({ ...p, ...patch }))}
                    onSubmit={() => fetchListings({ page: 1 })}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-xl-12">
                  <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
                    <div className="packages_table table-responsive">
                      <PropertyDataTable items={data.items} loading={loading} />

                      <div className="mt30">
                        <Pagination
                          page={data.page}
                          totalPages={data.totalPages}
                          total={data.total}
                          limit={data.limit}
                          loading={loading}
                          onPageChange={(p) => fetchListings({ page: p })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardProperties;
