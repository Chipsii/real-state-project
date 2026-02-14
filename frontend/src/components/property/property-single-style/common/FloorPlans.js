import React, { useMemo } from "react";
import Image from "next/image";

const FloorPlans = ({ property }) => {
  const floorPlanData = useMemo(() => {
    
    const plans = Array.isArray(property?.floorPlans) ? property.floorPlans : [];

    return plans.map((p, idx) => ({
      id: p.id || p._id || `floor-${idx + 1}`,
      title: p.title || `Floor Plan ${idx + 1}`,
      size: p.sizeSqft ? `${p.sizeSqft} Sqft` : "N/A",
      bedrooms: p.bedrooms ?? "N/A",
      bathrooms: p.bathrooms ?? "N/A",
      price:
        typeof p.price === "number"
          ? `${property?.currency || "USD"} ${p.price.toLocaleString()}`
          : p.price || "N/A",
      imageSrc: p.imageUrl || "/images/listings/floor-planning.png",
    }));
  }, [property]);

  if (!floorPlanData.length) {
    return <p className="text mb0">No floor plans available.</p>;
  }

  return (
    <div className="accordion" id="accordionExample">
      {floorPlanData.map((floorPlan, index) => (
        <div
          className={`accordion-item ${index === 1 ? "active" : ""}`}
          key={floorPlan.id}
        >
          <h2 className="accordion-header" id={`heading${index}`}>
            <button
              className={`accordion-button ${index === 1 ? "" : "collapsed"}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapse${index}`}
              aria-expanded={index === 1 ? "true" : "false"}
              aria-controls={`collapse${index}`}
            >
              <span className="w-100 d-md-flex align-items-center">
                <span className="mr10-sm">{floorPlan.title}</span>
                <span className="ms-auto d-md-flex align-items-center justify-content-end">
                  <span className="me-2 me-md-4">
                    <span className="fw600">Size:</span>
                    <span className="text">{floorPlan.size}</span>
                  </span>
                  <span className="me-2 me-md-4">
                    <span className="fw600">Bedrooms</span>
                    <span className="text">{floorPlan.bedrooms}</span>
                  </span>
                  <span className="me-2 me-md-4">
                    <span className="fw600">Bathrooms</span>
                    <span className="text">{floorPlan.bathrooms}</span>
                  </span>
                  <span>
                    <span className="fw600">Price</span>
                    <span className="text">{floorPlan.price}</span>
                  </span>
                </span>
              </span>
            </button>
          </h2>

          <div
            id={`collapse${index}`}
            className={`accordion-collapse collapse ${index === 1 ? "show" : ""}`}
            aria-labelledby={`heading${index}`}
            data-parent="#accordionExample"
          >
            <div className="accordion-body text-center">
              <Image
                width={736}
                height={544}
                className="w-100 h-100 cover"
                src={floorPlan.imageSrc}
                alt="listing figureout"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloorPlans;
