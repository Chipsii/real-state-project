"use client";
import { useRouter } from "next/navigation";
import React from "react";

const HeroContent = () => {
  const router = useRouter();
  const tabLabel = "Buy";

  return (
    <div className="advance-search-tab mt70 mt30-md mx-auto animate-up-3">
      <ul className="nav nav-tabs p-0 m-0">
        <li className="nav-item">
          <button className="nav-link active" type="button">
            {tabLabel}
          </button>
        </li>
      </ul>

      <div className="tab-content">
        <div className="active tab-pane">
          <div className="advance-content-style1">
            <div className="row">
              <div className="col-md-8 col-lg-9">
                <div className="advance-search-field position-relative text-start">
                  <form className="form-search position-relative">
                    <div className="box-search">
                      <span className="icon flaticon-home-1" />
                      <input
                        className="form-control bgc-f7 bdrs12"
                        type="text"
                        name="search"
                        placeholder={`Enter an address, neighborhood, city, or ZIP code for ${tabLabel}`}
                      />
                    </div>
                  </form>
                </div>
              </div>
              {/* End .col-md-8 */}

              <div className="col-md-4 col-lg-3">
                <div className="d-flex align-items-center justify-content-start justify-content-md-center mt-3 mt-md-0">
                  <button
                    className="advance-search-btn"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#advanceSeachModal"
                  >
                    <span className="flaticon-settings" /> Advanced
                  </button>
                  <button
                    className="advance-search-icon ud-btn btn-thm ms-4"
                    onClick={() => router.push("/map-v1")}
                    type="button"
                  >
                    <span className="flaticon-search" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
