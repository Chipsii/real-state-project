"use client";

import React, { useMemo } from "react";

const splitDescription = (text, limit = 260) => {
  const s = String(text || "").trim();
  if (!s) return { first: "", rest: "" };
  if (s.length <= limit) return { first: s, rest: "" };

  const cut = s.lastIndexOf(" ", limit);
  const idx = cut > 120 ? cut : limit;

  return {
    first: s.slice(0, idx).trim(),
    rest: s.slice(idx).trim(),
  };
};

const ProperytyDescriptions = ({ property }) => {
  const desc = property?.description || "";

  const { first, rest } = useMemo(() => splitDescription(desc, 320), [desc]);

  const safeFirst =
    first || "No description provided for this property yet.";

  return (
    <>
      <p className="text mb10">{safeFirst}</p>

      <div className="agent-single-accordion">
        <div className="accordion accordion-flush" id="accordionFlushExample">
          <div className="accordion-item">
            <div
              id="flush-collapseOne"
              className="accordion-collapse collapse"
              aria-labelledby="flush-headingOne"
              data-bs-parent="#accordionFlushExample"
              style={{}}
            >
              <div className="accordion-body p-0">
                <p className="text">
                  {rest || ""}
                </p>
              </div>
            </div>

            {rest ? (
              <h2 className="accordion-header" id="flush-headingOne">
                <button
                  className="accordion-button p-0 collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseOne"
                  aria-expanded="false"
                  aria-controls="flush-collapseOne"
                >
                  Show more
                </button>
              </h2>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProperytyDescriptions;
