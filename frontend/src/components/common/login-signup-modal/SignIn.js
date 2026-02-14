"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminLogin } from "@/services/auth/api";
import Link from "next/link";

const SignIn = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard-home";

  const [showing, setShowing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await adminLogin({ email, password });
      router.replace(next);
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-style1" onSubmit={handleSubmit}>
      {/* Email */}
      <div className="mb25">
        <label className="form-label fw600 dark-color">Email</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password */}
      <div className="mb15">
        <label className="form-label fw600 dark-color">Password</label>

        {/* Only this wrapper is relative */}
        <div className="position-relative">
          <input
            type={showing ? "text" : "password"}
            className="form-control pe-5"
            placeholder="Enter Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowing((prev) => !prev)}
            className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-2 p-0 text-decoration-none"
            style={{ fontSize: "14px", lineHeight: 1 }}
            aria-label={showing ? "Hide password" : "Show password"}
          >
            {showing ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Remember me */}
      <div className="checkbox-style1 d-block d-sm-flex align-items-center justify-content-between mb10">
        {/* <label className="custom_checkbox fz14 ff-heading">
          Remember me
          <input type="checkbox" defaultChecked />
          <span className="checkmark" />
        </label> */}
        <Link className="fz14 ff-heading" href="/forgot-password">
          Lost your password?
        </Link>
      </div>

      {/* Error */}
      {error && <p className="text-danger mb10">{error}</p>}

      {/* Submit */}
      <div className="d-grid mb20">
        <button className="ud-btn btn-thm" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}{" "}
          <i className="fal fa-arrow-right-long" />
        </button>
      </div>
    </form>
  );
};

export default SignIn;