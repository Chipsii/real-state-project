"use client";

import React from "react";
import Link from "next/link";



export default function StepRequest({
  email,
  setEmail,
  emailOk,
  loading,
  onSubmit,
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
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`form-control ${
            email.length > 0 && !emailOk ? "is-invalid" : ""
          }`}
          disabled={loading}
        />

        {email.length > 0 && !emailOk && (
          <div className="invalid-feedback">
            Please enter a valid email address.
          </div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-dark w-100"
        disabled={!emailOk || loading}
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            />
            Sending OTP...
          </>
        ) : (
          "Send OTP"
        )}
      </button>

      <div className="d-flex justify-content-between mt-3 small">
        <Link href="/login" className="link-secondary text-decoration-underline">
          Back to login
        </Link>
      </div>
    </form>
  );
}
