"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PropertyDescription from "./property-description";
import UploadMedia from "./upload-media";
import LocationField from "./LocationField";
import DetailsFiled from "./details-field";
import Amenities from "./Amenities";
import {
  createListing,
  getListingById,
  updateListing,
} from "@/services/listing/listings.service";
import FloorPlansStep from "../../property-single-style/common/floorPlan";




const initialForm = () => ({
  title: "",
  propertyType: "Houses",
  businessType: "",
  price: 0,
  forRent: false,
  currency: "USD",
  featured: false,
  yearBuilding: new Date().getFullYear(),

  description: "",
  propertyStatus: "",

  media: {
    cover: null,
    gallery: [],
    video: null,
    virtualTourUrl: "",
  },

  city: "",
  locationText: "",
  lat: null,
  lng: null,

  zip: "",
  thana: "",
  neighborhood: "",

  beds: 0,
  baths: 0,
  sqft: 0,

  features: [],
  tags: [],

  floorPlans: [],
});

const AddPropertyTabContent = ({ listingId }) => {
  const router = useRouter();
  const isEdit = Boolean(listingId);

  const [form, setForm] = useState(initialForm());
  const [activeStep, setActiveStep] = useState(1);

  const [errors, setErrors] = useState({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
    step6: {},
  });

  const [touchedSteps, setTouchedSteps] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
    step6: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [loadingListing, setLoadingListing] = useState(isEdit);

  const [prompt, setPrompt] = useState({
    open: false,
    mode: "loading",
    title: "",
    message: "",
  });

  const updateForm = (patch) => setForm((p) => ({ ...p, ...patch }));
  const updateMedia = (mediaPatch) =>
    setForm((p) => ({ ...p, media: { ...p.media, ...mediaPatch } }));

  const markTouched = (step) => {
    setTouchedSteps((prev) => ({ ...prev, [`step${step}`]: true }));
  };

  const setStepErrors = (step, obj) => {
    setErrors((prev) => ({ ...prev, [`step${step}`]: obj }));
  };

  const resetAllErrors = () => {
    setErrors({ step1: {}, step2: {}, step3: {}, step4: {}, step5: {}, step6: {} });
  };

  const resetTouched = () => {
    setTouchedSteps({
      step1: false,
      step2: false,
      step3: false,
      step4: false,
      step5: false,
      step6: false,
    });
  };

  const clickBootstrapTab = (step) => {
    document.getElementById(`nav-item${step}-tab`)?.click();
  };
      console.log(form)


  const goToStep = (step) => {
    if (submitting) return;

    if (step < activeStep) {
      setActiveStep(step);
      clickBootstrapTab(step);
      return;
    }

    for (let s = 1; s < step; s++) {
      const e = validateStep(s);
      setStepErrors(s, e);

      if (Object.keys(e).length) {
        markTouched(s);
        setActiveStep(s);
        clickBootstrapTab(s);
        return;
      }
    }

    setActiveStep(step);
    clickBootstrapTab(step);
  };

  const applyBackendFieldErrors = (items) => {
    const step1 = {};
    const step2 = {};
    const step3 = {};
    const step4 = {};
    const step5 = {};
    const step6 = {};

    const push = (obj, key, msg) => {
      if (!key) return;
      obj[key] = msg || "Invalid value";
    };

    for (const it of items || []) {
      const p = it?.path || it?.instancePath || it?.dataPath || it?.field || "";
      const msg = it?.message || it?.msg || "Invalid value";
      const pathStr = String(p).replace(/^body\.?/, "").replace(/\//g, ".");

      if (pathStr.includes("media.cover")) push(step2, "cover", msg);
      else if (pathStr.includes("media.gallery")) push(step2, "gallery", msg);
      else if (pathStr.includes("media.video")) push(step2, "video", msg);
      else if (pathStr.includes("media.virtualTourUrl")) push(step2, "virtualTourUrl", msg);

      else if (pathStr.includes("title")) push(step1, "title", msg);
      else if (pathStr.includes("businessType")) push(step1, "businessType", msg);
      else if (pathStr.includes("propertyType")) push(step1, "propertyType", msg);
      else if (pathStr.includes("price")) push(step1, "price", msg);
      else if (pathStr.includes("currency")) push(step1, "currency", msg);
      else if (pathStr.includes("forRent")) push(step1, "forRent", msg);
      else if (pathStr.includes("featured")) push(step1, "featured", msg);
      else if (pathStr.includes("yearBuilding")) push(step1, "yearBuilding", msg);

      else if (pathStr.includes("city")) push(step3, "city", msg);
      else if (pathStr.includes("locationText")) push(step3, "locationText", msg);
      else if (pathStr.includes("lat")) push(step3, "lat", msg);
      else if (pathStr.includes("lng")) push(step3, "lng", msg);

      else if (pathStr.includes("beds")) push(step4, "beds", msg);
      else if (pathStr.includes("baths")) push(step4, "baths", msg);
      else if (pathStr.includes("sqft")) push(step4, "sqft", msg);

      else if (pathStr.includes("features")) push(step5, "features", msg);
      else if (pathStr.includes("tags")) push(step5, "tags", msg);

      else if (pathStr.includes("floorPlans")) push(step6, "floorPlans", msg);
    }

    setErrors({ step1, step2, step3, step4, step5, step6 });

    const order = [step1, step2, step3, step4, step5, step6];
    const firstBad = order.findIndex((x) => Object.keys(x).length);
    if (firstBad >= 0) {
      const step = firstBad + 1;
      markTouched(step);
      setActiveStep(step);
      clickBootstrapTab(step);
    }
  };

  const getFriendlyErrorMessage = (err) => {
    const status = err?.response?.status;
    const data = err?.response?.data;

    const msg = data?.message || data?.error || err?.message || "Something went wrong";

    if (status === 402) return msg || "Please check your input and try again.";
    if (status === 401) return "Your session expired. Please log in again.";
    if (status === 413) return "Files are too large.";
    if (status === 415) return "Unsupported file type.";
    if (status >= 500) return "Server error. Please try again in a moment.";

    return msg;
  };

  const openPrompt = (mode, title, message) => {
    setPrompt({ open: true, mode, title, message });
  };

  const closePrompt = () => setPrompt((p) => ({ ...p, open: false }));

  const goToMyProperties = () => {
    closePrompt();
    router.push("/dashboard-my-properties");
  };

  const validateStep = (step) => {
    const e = {};

    if (step === 1) {
      if (!form.title || form.title.trim().length < 2) e.title = "Title is required (min 2 characters).";
      if (!form.businessType || !String(form.businessType).trim()) e.businessType = "Business type is required.";
      if (!form.propertyStatus || !String(form.propertyStatus).trim()) e.propertyStatus = "property status is required.";
      if (!form.propertyType || !String(form.propertyType).trim()) e.propertyType = "Property type is required.";
      if (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0) e.price = "Price must be greater than 0.";
      if (!Number.isFinite(Number(form.yearBuilding)) || Number(form.yearBuilding) < 1000) e.yearBuilding = "Year built is required.";
    }

    if (step === 2) {
      if (!form.media?.cover?.url) e.cover = "Cover image is required.";
    }

    if (step === 3) {
      if (!form.city || !form.city.trim()) e.city = "City is required.";
      if (!form.locationText || !form.locationText.trim()) e.locationText = "Address/Location text is required.";
      if (!Number.isFinite(Number(form.lat))) e.lat = "Please select a location on the map.";
      if (!Number.isFinite(Number(form.lng))) e.lng = "Please select a location on the map.";
    }

    if (step === 4) {
      if (!Number.isFinite(Number(form.beds)) || Number(form.beds) < 0) e.beds = "Beds must be 0 or more.";
      if (!Number.isFinite(Number(form.baths)) || Number(form.baths) < 0) e.baths = "Baths must be 0 or more.";
      if (!Number.isFinite(Number(form.sqft)) || Number(form.sqft) < 0) e.sqft = "Sqft must be 0 or more.";
    }

    if (step === 6) {
      const plans = Array.isArray(form.floorPlans) ? form.floorPlans : [];
      if (plans.length) {
        const bad = plans.find((p) => !p?.title || !String(p.title).trim() || !p?.image?.url);
        if (bad) e.floorPlans = "Each floor plan must have a title and an image URL.";
      }
    }

    return e;
  };

  const handleNext = () => {
    if (submitting) return;

    markTouched(activeStep);

    const e = validateStep(activeStep);
    setStepErrors(activeStep, e);

    if (Object.keys(e).length) return;

    const next = Math.min(6, activeStep + 1);
    setActiveStep(next);
    clickBootstrapTab(next);
  };

  const handleBack = () => {
    if (submitting) return;
    const prev = Math.max(1, activeStep - 1);
    setActiveStep(prev);
    clickBootstrapTab(prev);
  };

  useEffect(() => {
    if (!isEdit) return;

    let alive = true;

    (async () => {
      try {
        setLoadingListing(true);
        const res = await getListingById(listingId);
        const data = res?.data ?? res;

        if (!alive) return;

        const geoCoords = data?.geo?.coordinates;
        const lngFromGeo = Array.isArray(geoCoords) ? geoCoords[0] : null;
        const latFromGeo = Array.isArray(geoCoords) ? geoCoords[1] : null;

        setForm({
          ...initialForm(),
          ...data,

          media: {
            cover: data?.media?.cover ?? null,
            gallery: data?.media?.gallery ?? [],
            video: data?.media?.video ?? null,
            virtualTourUrl: data?.media?.virtualTourUrl ?? "",
          },

          price: Number(data?.price ?? 0),
          beds: Number(data?.beds ?? 0),
          baths: Number(data?.baths ?? 0),
          sqft: Number(data?.sqft ?? 0),
          yearBuilding: Number(data?.yearBuilding ?? new Date().getFullYear()),

          businessType: data?.businessType ?? "",
          propertyType: data?.propertyType ?? "Houses",

          lat: data?.lat ?? latFromGeo ?? null,
          lng: data?.lng ?? lngFromGeo ?? null,

          floorPlans: Array.isArray(data?.floorPlans) ? data.floorPlans : [],
        });

        resetAllErrors();
        resetTouched();
        setActiveStep(1);
        clickBootstrapTab(1);
      } catch (err) {
        console.error(err);
        openPrompt("error", "Could not load listing", getFriendlyErrorMessage(err));
      } finally {
        if (alive) setLoadingListing(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [listingId, isEdit]);

  const handleSubmit = async () => {
    if (submitting) return;

    for (let s = 1; s <= 6; s++) markTouched(s);

    for (let s = 1; s <= 6; s++) {
      const e = validateStep(s);
      setStepErrors(s, e);

      if (Object.keys(e).length) {
        setActiveStep(s);
        clickBootstrapTab(s);
        return;
      }
    }

    resetAllErrors();const payload = {
  title: form.title,
  description: form.description ?? "",

  media: form.media,

  city: form.city,
  locationText: form.locationText,

  zip: form.zip ?? "",
  thana: form.thana ?? "",
  neighborhood: form.neighborhood ?? "",

  beds: Number(form.beds),
  baths: Number(form.baths),
  sqft: Number(form.sqft),

  price: Number(form.price),
  currency: form.currency || "USD",

  forRent: Boolean(form.forRent),
  featured: Boolean(form.featured),

  businessType: form.businessType,
  propertyType: form.propertyType,
  yearBuilding: Number(form.yearBuilding),

  propertyStatus: form.propertyStatus ?? "Pending",

  tags: form.tags ?? [],
  features: form.features ?? [],

  floorPlans: form.floorPlans ?? [],

  lotSize: form.lotSize ?? "",
  rooms: form.rooms !== undefined && form.rooms !== "" ? Number(form.rooms) : 0,

  customId: form.customId?.trim() ? form.customId.trim() : undefined,

  garages: form.garages !== undefined && form.garages !== "" ? Number(form.garages) : 0,
  garageSize: form.garageSize ?? "",

  availableFrom: form.availableFrom ? String(form.availableFrom) : null,

  basement: form.basement ?? "",
  extraDetails: form.extraDetails ?? "",
  roofing: form.roofing ?? "",
  exteriorMaterial: form.exteriorMaterial ?? "",
  ownerNotes: form.ownerNotes ?? "",

  lat: Number(form.lat),
  lng: Number(form.lng),
};

    try {
      setSubmitting(true);

      openPrompt(
        "loading",
        isEdit ? "Updating listing" : "Creating listing",
        isEdit
          ? "Please wait while we update your property…"
          : "Please wait while we save your property…"
      );

      if (isEdit) {
        await updateListing(listingId, payload);
        openPrompt("success", "Listing updated", "Your changes were saved successfully.");
      } else {
        await createListing(payload);
        openPrompt("success", "Listing created", "Your property has been added successfully.");
        setForm(initialForm());
        resetTouched();
        resetAllErrors();
        setActiveStep(1);
        clickBootstrapTab(1);
      }
    } catch (err) {
      console.error(err);

      const backendErrors =
        err?.response?.data?.errors ||
        err?.response?.data?.details ||
        err?.response?.data?.validation ||
        null;

      if (Array.isArray(backendErrors) && backendErrors.length) {
        applyBackendFieldErrors(backendErrors);
        openPrompt(
          "error",
          "Please review the form",
          "Some fields need attention. Fix the highlighted fields and try again."
        );
        return;
      }

      openPrompt(
        "error",
        isEdit ? "Could not update listing" : "Could not create listing",
        getFriendlyErrorMessage(err)
      );
    } finally {
      setSubmitting(false);
    }
  };

  const PromptModal = () => {
    if (!prompt.open) return null;

    const isLoading = prompt.mode === "loading";
    const isSuccess = prompt.mode === "success";

    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
        role="dialog"
        aria-modal="true"
      >
        <div className="bgc-white bdrs12 default-box-shadow2" style={{ width: "100%", maxWidth: 520, padding: 22 }}>
          <h4 className="title fz17 mb10">{prompt.title}</h4>
          <p className="text mb20" style={{ marginBottom: 18 }}>
            {prompt.message}
          </p>

          <div className="d-flex gap-2 justify-content-end">
            {isLoading ? (
              <button type="button" className="ud-btn btn-theme" disabled>
                Saving...
              </button>
            ) : isSuccess ? (
              <button type="button" className="ud-btn btn-theme" onClick={goToMyProperties}>
                OK
              </button>
            ) : (
              <button type="button" className="ud-btn btn-white" onClick={closePrompt}>
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loadingListing) {
    return (
      <div className="ps-widget bgc-white bdrs12 p30">
        <h4 className="title fz17 mb10">Loading property…</h4>
        <p className="text mb0">Please wait while we fetch the listing details.</p>
      </div>
    );
  }

  return (
    <>
      <PromptModal />

      <nav>
        <div className="nav nav-tabs" id="nav-tab2" role="tablist">
          <button
            className="nav-link active fw600 ms-3"
            id="nav-item1-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item1"
            type="button"
            role="tab"
            aria-controls="nav-item1"
            aria-selected="true"
            onClick={() => goToStep(1)}
            disabled={submitting}
          >
            1. Description
          </button>

          <button
            className="nav-link fw600"
            id="nav-item2-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item2"
            type="button"
            role="tab"
            aria-controls="nav-item2"
            aria-selected="false"
            onClick={() => goToStep(2)}
            disabled={submitting}
          >
            2. Media
          </button>

          <button
            className="nav-link fw600"
            id="nav-item3-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item3"
            type="button"
            role="tab"
            aria-controls="nav-item3"
            aria-selected="false"
            onClick={() => goToStep(3)}
            disabled={submitting}
          >
            3. Location
          </button>

          <button
            className="nav-link fw600"
            id="nav-item4-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item4"
            type="button"
            role="tab"
            aria-controls="nav-item4"
            aria-selected="false"
            onClick={() => goToStep(4)}
            disabled={submitting}
          >
            4. Detail
          </button>

          <button
            className="nav-link fw600"
            id="nav-item5-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item5"
            type="button"
            role="tab"
            aria-controls="nav-item5"
            aria-selected="false"
            onClick={() => goToStep(5)}
            disabled={submitting}
          >
            5. Amenities
          </button>

          <button
            className="nav-link fw600"
            id="nav-item6-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-item6"
            type="button"
            role="tab"
            aria-controls="nav-item6"
            aria-selected="false"
            onClick={() => goToStep(6)}
            disabled={submitting}
          >
            6. Floor Plans
          </button>
        </div>
      </nav>

      <div className="tab-content" id="nav-tabContent">
        <div className="tab-pane fade show active" id="nav-item1" role="tabpanel" aria-labelledby="nav-item1-tab">
          <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
            <h4 className="title fz17 mb30">{isEdit ? "Edit Property Description" : "Property Description"}</h4>
            <PropertyDescription value={form} onChange={updateForm} errors={errors.step1} touched={touchedSteps.step1} disabled={submitting} />
          </div>
        </div>

        <div className="tab-pane fade" id="nav-item2" role="tabpanel" aria-labelledby="nav-item2-tab">
          <UploadMedia media={form.media} onChange={updateMedia} errors={errors.step2} touched={touchedSteps.step2} disabled={submitting} />
        </div>

        <div className="tab-pane fade" id="nav-item3" role="tabpanel" aria-labelledby="nav-item3-tab">
          <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
            <h4 className="title fz17 mb30">Listing Location</h4>
            <LocationField value={form} onChange={updateForm} errors={errors.step3} touched={touchedSteps.step3} disabled={submitting} />
          </div>
        </div>

        <div className="tab-pane fade" id="nav-item4" role="tabpanel" aria-labelledby="nav-item4-tab">
          <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
            <h4 className="title fz17 mb30">Listing Details</h4>
            <DetailsFiled value={form} onChange={updateForm} errors={errors.step4} touched={touchedSteps.step4} disabled={submitting} />
          </div>
        </div>

        <div className="tab-pane fade" id="nav-item5" role="tabpanel" aria-labelledby="nav-item5-tab">
          <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
            <h4 className="title fz17 mb30">Select Amenities</h4>
            <div className="row">
              <Amenities value={form} onChange={updateForm} errors={errors.step5} touched={touchedSteps.step5} disabled={submitting} />
            </div>

            <div className="mt30 d-flex gap-2">
              <button type="button" className="ud-btn btn-white" onClick={handleBack} disabled={submitting}>
                Back
              </button>

              <button type="button" className="ud-btn btn-theme" onClick={handleNext} disabled={submitting}>
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="tab-pane fade" id="nav-item6" role="tabpanel" aria-labelledby="nav-item6-tab">
          <div className="ps-widget bgc-white bdrs12 p30 overflow-hidden position-relative">
            <h4 className="title fz17 mb30">Add Floor Plans</h4>

            <FloorPlansStep
              value={form}
              onChange={updateForm}
              errors={errors.step6}
              touched={touchedSteps.step6}
              disabled={submitting}
            />

            <div className="mt30 d-flex gap-2">
              <button type="button" className="ud-btn btn-white" onClick={handleBack} disabled={submitting}>
                Back
              </button>

              <button type="button" className="ud-btn btn-theme" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Saving..." : isEdit ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {activeStep < 6 && (
        <div className="mt30 d-flex gap-2">
          <button type="button" className="ud-btn btn-white" onClick={handleBack} disabled={activeStep === 1 || submitting}>
            Back
          </button>

          <button type="button" className="ud-btn btn-theme" onClick={handleNext} disabled={submitting}>
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default AddPropertyTabContent;
