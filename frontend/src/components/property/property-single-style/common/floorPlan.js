"use client";

import React, { useRef, useState } from "react";
import { uploadImage } from "@/services/listing/listings.service";
import Image from "next/image";

export const FloorPlansStep = ({
  value,
  onChange,
  errors = {},
  touched = false,
  disabled = false,
}) => {
  const plans = Array.isArray(value?.floorPlans) ? value.floorPlans : [];
  const fileRefs = useRef({});
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const patchPlans = (next) => onChange?.({ floorPlans: next });

  const addPlan = () => {
    const next = [
      ...plans,
      {
        title: "",
        sizeSqft: 0,
        bedrooms: 0,
        bathrooms: 0,
        price: 0,
        currency: value?.currency || "USD",
        image: { url: "", alt: "", order: 0 },
        description: "",
        order: plans.length,
      },
    ];
    patchPlans(next);
  };

  const removePlan = (idx) => {
    const next = plans
      .filter((_, i) => i !== idx)
      .map((p, i) => ({ ...p, order: i }));
    patchPlans(next);
  };

  const updatePlan = (idx, patch) => {
    const next = plans.map((p, i) => (i === idx ? { ...p, ...patch } : p));
    patchPlans(next);
  };

  const updatePlanImage = (idx, patch) => {
    const next = plans.map((p, i) =>
      i === idx ? { ...p, image: { ...(p.image || {}), ...patch } } : p
    );
    patchPlans(next);
  };

  const triggerPick = (idx) => {
    if (disabled) return;
    fileRefs.current[idx]?.click?.();
  };

  const onPickFile = async (idx, file) => {
    if (!file) return;

    try {
      setUploadingIndex(idx);

      const uploaded = await uploadImage(file);
      const url = String(uploaded|| "").trim();

      if (!url) throw new Error("Upload failed (missing url).");

      updatePlanImage(idx, {
        url,
        alt: uploaded?.alt || file?.name || "",
      });
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to upload image");
    } finally {
      setUploadingIndex(null);
      if (fileRefs.current[idx]) fileRefs.current[idx].value = "";
    }
  };

  return (
    <div className="row">
      <div className="col-12 mb15 d-flex align-items-center justify-content-between">
        <h5 className="mb-0">Floor Plans</h5>
        <button
          type="button"
          className="ud-btn btn-theme"
          onClick={addPlan}
          disabled={disabled}
        >
          + Add Floor Plan
        </button>
      </div>

      {touched && errors?.floorPlans && (
        <div className="col-12">
          <div className="text-danger mb15" style={{ fontSize: 13 }}>
            {errors.floorPlans}
          </div>
        </div>
      )}

      {plans.length === 0 ? (
        <div className="col-12">
          <p className="text mb0">No floor plans added yet (optional).</p>
        </div>
      ) : (
        plans.map((p, idx) => {
          const uploading = uploadingIndex === idx;
          const imgUrl = String(p?.image?.url || "").trim();
          const hasImg = imgUrl.length > 5; // avoids "h" / bad strings

          return (
            <div key={idx} className="col-12 mb20">
              <div className="p20 bdrs12 bdr1 bgc-white">
                <div className="d-flex justify-content-between align-items-center mb15">
                  <h6 className="mb-0">Plan #{idx + 1}</h6>
                  <button
                    type="button"
                    className="ud-btn btn-white"
                    onClick={() => removePlan(idx)}
                    disabled={disabled}
                  >
                    Remove
                  </button>
                </div>

                <div className="row">
                  <div className="col-md-6 mb15">
                    <label className="form-label fw600">Title</label>
                    <input
                      className="form-control"
                      value={p.title || ""}
                      onChange={(e) => updatePlan(idx, { title: e.target.value })}
                      disabled={disabled}
                      placeholder="e.g. First Floor"
                    />
                  </div>

                  {/* ✅ Upload + Preview */}
                  <div className="col-md-6 mb15">
                    <label className="form-label fw600">Floor Plan Image</label>

                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="ud-btn btn-theme"
                        onClick={() => triggerPick(idx)}
                        disabled={disabled || uploading}
                      >
                        {uploading ? "Uploading..." : "Upload Image"}
                      </button>

                      <button
                        type="button"
                        className="ud-btn btn-white"
                        onClick={() => updatePlanImage(idx, { url: "", alt: "" })}
                        disabled={disabled || !hasImg}
                      >
                        Remove Image
                      </button>
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => (fileRefs.current[idx] = el)}
                      style={{ display: "none" }}
                      onChange={(e) => onPickFile(idx, e.target.files?.[0])}
                      disabled={disabled}
                    />

                    {hasImg ? (
                      <div className="mt10">
                        <Image
                          unoptimized
                          src={imgUrl}
                          alt={p.image?.alt || "floor-plan"}
                          width={1200}   // ✅ required
                          height={600}   // ✅ required
                          style={{
                            width: "100%",
                            maxWidth: 360,
                            height: 180,
                            objectFit: "cover",
                            borderRadius: 10,
                            border: "1px solid #eee",
                          }}
                        />

                        <div className="mt10">
                          <label className="form-label fw600">Alt (optional)</label>
                          <input
                            className="form-control"
                            value={p?.image?.alt || ""}
                            onChange={(e) => updatePlanImage(idx, { alt: e.target.value })}
                            disabled={disabled}
                            placeholder="Alt text"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt10">
                        <label className="form-label fw600">Or paste Image URL</label>
                        <input
                          className="form-control"
                          value={imgUrl}
                          onChange={(e) => updatePlanImage(idx, { url: e.target.value })}
                          disabled={disabled}
                          placeholder="https://..."
                        />
                      </div>
                    )}
                  </div>

                  <div className="col-md-4 mb15">
                    <label className="form-label fw600">Size (sqft)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={Number(p.sizeSqft ?? 0)}
                      onChange={(e) => updatePlan(idx, { sizeSqft: Number(e.target.value) })}
                      disabled={disabled}
                      min={0}
                    />
                  </div>

                  <div className="col-md-4 mb15">
                    <label className="form-label fw600">Bedrooms</label>
                    <input
                      type="number"
                      className="form-control"
                      value={Number(p.bedrooms ?? 0)}
                      onChange={(e) => updatePlan(idx, { bedrooms: Number(e.target.value) })}
                      disabled={disabled}
                      min={0}
                    />
                  </div>

                  <div className="col-md-4 mb15">
                    <label className="form-label fw600">Bathrooms</label>
                    <input
                      type="number"
                      className="form-control"
                      value={Number(p.bathrooms ?? 0)}
                      onChange={(e) => updatePlan(idx, { bathrooms: Number(e.target.value) })}
                      disabled={disabled}
                      min={0}
                    />
                  </div>

                  <div className="col-md-6 mb15">
                    <label className="form-label fw600">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      value={Number(p.price ?? 0)}
                      onChange={(e) => updatePlan(idx, { price: Number(e.target.value) })}
                      disabled={disabled}
                      min={0}
                    />
                  </div>

                  <div className="col-md-6 mb15">
                    <label className="form-label fw600">Currency</label>
                    <input
                      className="form-control"
                      value={p.currency || value?.currency || "USD"}
                      onChange={(e) => updatePlan(idx, { currency: e.target.value })}
                      disabled={disabled}
                      placeholder="USD"
                    />
                  </div>

                  <div className="col-12 mb0">
                    <label className="form-label fw600">Description (optional)</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={p.description || ""}
                      onChange={(e) => updatePlan(idx, { description: e.target.value })}
                      disabled={disabled}
                      placeholder="Short notes about this floor plan..."
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default FloorPlansStep;
