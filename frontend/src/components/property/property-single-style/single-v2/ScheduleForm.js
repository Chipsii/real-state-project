"use client";

import React, { useState } from "react";

const ScheduleForm = ({ property, onContactClick }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    agree: false,
  });

  const title = property?.title || "this property";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.agree) {
      alert("Please agree to the Terms of Use.");
      return;
    }

    // ✅ TRACK (only after validation passes)
    onContactClick?.({
      source: "schedule_form",
      action: "submit_tour_request",
    });

    // 🔌 ready for API integration
    const payload = {
      ...form,
      propertyId: property?._id || property?.id,
    };

    console.log("Schedule tour payload:", payload);

    // reset (optional)
    setForm({
      name: "",
      email: "",
      phone: "",
      message: "",
      agree: false,
    });
  };

  return (
    <form className="form-style1" onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-lg-12">
          <div className="mb15">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-md-12">
          <div className="mb15">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-lg-12">
          <div className="mb15">
            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder="Enter your phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-md-12">
          <div className="mb15">
            <textarea
              name="message"
              cols={30}
              rows={4}
              value={form.message || `Hello, I am interested in ${title}.`}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="checkbox-style1 d-block d-sm-flex align-items-center justify-content-between mb10">
          <label className="custom_checkbox fz14 ff-heading">
            By submitting form I agree to Terms of Use
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
            />
            <span className="checkmark" />
          </label>
        </div>

        <div className="col-md-12">
          <div className="d-grid">
            <button type="submit" className="ud-btn btn-thm">
              Submit a Tour Request
              <i className="fal fa-arrow-right-long" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ScheduleForm;
