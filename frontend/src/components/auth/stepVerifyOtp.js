"use client";

import React from "react";


export default function StepVerifyOtp({
  email,
  otp,
  setOtp,
  otpOk,
  loading,
  cooldown,
  onSubmit,
  onResend,
  onChangeEmail,
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="mt-4"
      noValidate
    >
      {/* Email (read-only) */}
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          value={email.trim()}
          readOnly
          className="form-control bg-light"
        />
      </div>

      {/* OTP */}
      <div className="mb-3">
        <label htmlFor="otp" className="form-label">
          OTP
        </label>
        <input
          id="otp"
          name="otp"
          inputMode="numeric"
          pattern="\d*"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, ""))}
          className={`form-control ${
            otp.length > 0 && !otpOk ? "is-invalid" : ""
          }`}
          disabled={loading}
        />

        {otp.length > 0 && !otpOk && (
          <div className="invalid-feedback">
            OTP should be 4–8 digits.
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="btn btn-dark w-100"
        disabled={!otpOk || loading}
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            />
            Verifying...
          </>
        ) : (
          "Verify OTP"
        )}
      </button>

      {/* Actions */}
      <div className="d-flex justify-content-between mt-3 small">
        <button
          type="button"
          onClick={onResend}
          disabled={loading || cooldown > 0}
          className="btn btn-link p-0 link-secondary text-decoration-underline"
        >
          {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
        </button>

        <button
          type="button"
          onClick={onChangeEmail}
          disabled={loading}
          className="btn btn-link p-0 link-secondary text-decoration-underline"
        >
          Change email
        </button>
      </div>
    </form>
  );
}
