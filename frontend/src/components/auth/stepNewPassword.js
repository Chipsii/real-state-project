"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { passwordChecks } from "./helpers";


function strengthLabel(pw) {
  const c = passwordChecks(pw);
  const categories = [c.hasUpper, c.hasLower, c.hasNum, c.hasSym].filter(Boolean).length;

  if (!pw) return { label: "", cls: "text-muted" };
  if (pw.length < 8) return { label: "Too short", cls: "text-danger"};
  if (categories <= 1) return { label: "Weak", cls: "text-danger"};
  if (categories === 2) return { label: "Fair", cls: "text-warning"};
  if (categories === 3) return { label: "Good", cls: "text-success"};
  return { label: "Strong", cls: "text-success"};
}

export default function StepNewPassword({
  email,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  pwOk,
  pwMatch,
  loading,
  onSubmit,
  onBackToOtp,
}) {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReq, setShowReq] = useState(false);

  const strength = useMemo(() => strengthLabel(newPassword), [newPassword]);
  const checks = useMemo(() => passwordChecks(newPassword), [newPassword]);

  const confirmTouched = confirmNewPassword.length > 0;
  const showConfirmOk = confirmTouched && pwMatch;
  const showConfirmBad = confirmTouched && !pwMatch;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="mt-4"
      noValidate
    >
      {/* Email */}
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input value={email.trim()} readOnly className="form-control bg-light" />
      </div>

      {/* New Password */}
      <div className="mb-2">
        <label htmlFor="newPassword" className="form-label">
          New password
        </label>

        <div className="input-group">
          <input
            id="newPassword"
            type={showNew ? "text" : "password"}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={`form-control ${newPassword && !pwOk ? "is-invalid" : ""}`}
            disabled={loading}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowNew((v) => !v)}
            aria-label={showNew ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showNew ? "Hide" : "Show"}
          </button>
        </div>

        {/* Compact helper row */}
        <div className="d-flex align-items-center justify-content-between mt-2">
          <small className={`m-0 ${strength.cls}`}>
            {newPassword ? `Strength: ${strength.label}` : "Use 8+ characters with a mix of types."}
          </small>

          <button
            type="button"
            className="btn btn-link p-0 small text-decoration-underline link-secondary"
            onClick={() => setShowReq((v) => !v)}
          >
            {showReq ? "Hide requirements" : "View requirements"}
          </button>
        </div>

        {/* Requirements (small + collapsible, not a giant box) */}
        {showReq && (
          <div className="mt-2">
            <ul className="small text-muted mb-0">
              <li className={checks.minLen ? "text-success" : undefined}>At least 8 characters</li>
              <li className={checks.hasUpper ? "text-success" : undefined}>One uppercase letter</li>
              <li className={checks.hasLower ? "text-success" : undefined}>One lowercase letter</li>
              <li className={checks.hasNum ? "text-success" : undefined}>One number</li>
              <li className={checks.hasSym ? "text-success" : undefined}>One symbol</li>
            </ul>
          </div>
        )}

        {/* Optional inline invalid feedback */}
        {newPassword && !pwOk && (
          <div className="invalid-feedback d-block">
            Password must be at least 8 characters and include a mix (letters/numbers/symbols).
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="mb-3 mt-3">
        <label htmlFor="confirmNewPassword" className="form-label">
          Confirm new password
        </label>

        <div className="input-group">
          <input
            id="confirmNewPassword"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className={`form-control ${showConfirmBad ? "is-invalid" : showConfirmOk ? "is-valid" : ""}`}
            disabled={loading}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>

        {showConfirmBad && <div className="invalid-feedback">Passwords do not match.</div>}
        {showConfirmOk && <div className="valid-feedback">Looks good.</div>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="btn btn-dark w-100"
        disabled={!pwOk || !pwMatch || loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
            Updating...
          </>
        ) : (
          "Update password"
        )}
      </button>

      {/* Actions */}
      <div className="d-flex justify-content-between mt-3 small">
        <button
          type="button"
          onClick={onBackToOtp}
          disabled={loading}
          className="btn btn-link p-0 link-secondary text-decoration-underline"
        >
          Back to OTP
        </button>

        <Link href="/login" className="link-secondary text-decoration-underline">
          Back to login
        </Link>
      </div>
    </form>
  );
}
