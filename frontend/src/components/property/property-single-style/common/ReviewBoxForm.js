"use client";
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
const ReviewBoxForm = ({ propertyId }) => {
  const inqueryType = useMemo(
    () => [
      { value: 5, label: "Five Star" },
      { value: 4, label: "Four Star" },
      { value: 3, label: "Three Star" },
      { value: 2, label: "Two Star" },
      { value: 1, label: "One Star" },
    ],
    []
  );

  const customStyles = {
    option: (styles, { isFocused, isSelected, isHovered }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "#eb6753"
        : isHovered
        ? "#eb675312"
        : isFocused
        ? "#eb675312"
        : undefined,
    }),
  };

  const [showSelect, setShowSelect] = useState(false);

  // form state
  const [form, setForm] = useState({
    email: "",
    title: "",
    rating: inqueryType[0], 
    review: "",
  });

  // UX state
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" }); // type: "success" | "error" | ""

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setShowSelect(true);
  }, []);

  const setField = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => {
      if (!p[key]) return p;
      const next = { ...p };
      delete next[key];
      return next;
    });
    if (status.message) setStatus({ type: "", message: "" });
  };

  const validate = () => {
    const e = {};
    const email = String(form.email || "").trim();
    const title = String(form.title || "").trim();
    const review = String(form.review || "").trim();

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!email) e.email = "Email is required.";
    else if (!emailOk) e.email = "Please enter a valid email.";

    if (!title) e.title = "Title is required.";
    else if (title.length < 2) e.title = "Title must be at least 2 characters.";

    if (!form.rating || !form.rating.value) e.rating = "Rating is required.";

    if (!review) e.review = "Review is required.";
    else if (review.length < 10) e.review = "Review should be at least 10 characters.";

    return e;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setTouched({ email: true, title: true, rating: true, review: true });

    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    if (!propertyId) {
      setStatus({
        type: "error",
        message: "Missing property id. Please refresh the page and try again.",
      });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const payload = {
        propertyId,
        email: form.email.trim(),
        title: form.title.trim(),
        rating: Number(form.rating.value),
        review: form.review.trim(),
      };

      await new Promise((r) => setTimeout(r, 600));

      setStatus({
        type: "success",
        message: "Thanks! Your review has been submitted.",
      });

      setForm({
        email: "",
        title: "",
        rating: inqueryType[0],
        review: "",
      });
      setTouched({});
      setErrors({});
    } catch (err) {
      setStatus({
        type: "error",
        message: "Could not submit your review. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="comments_form mt30" onSubmit={handleSubmit}>
      <div className="row">
        {status.message ? (
          <div className="col-12">
            <div
              className="mb-4"
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid",
                borderColor: status.type === "success" ? "#b7ebc6" : "#f5b5b5",
                background: status.type === "success" ? "#f0fff4" : "#fff5f5",
              }}
            >
              <p style={{ margin: 0 }}>
                {status.message}
              </p>
            </div>
          </div>
        ) : null}

        <div className="col-md-12">
          <div className="mb-4">
            <label className="fw600 ff-heading mb-2">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="ibthemes21@gmail.com"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, email: true }))}
              required
              disabled={submitting}
            />
            {touched.email && errors.email ? (
              <p style={{ color: "red", marginTop: 6, marginBottom: 0 }}>
                {errors.email}
              </p>
            ) : null}
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-4">
            <label className="fw600 ff-heading mb-2">Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Title"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, title: true }))}
              required
              disabled={submitting}
            />
            {touched.title && errors.title ? (
              <p style={{ color: "red", marginTop: 6, marginBottom: 0 }}>
                {errors.title}
              </p>
            ) : null}
          </div>
        </div>

        <div className="col-md-6">
          <div className="widget-wrapper sideborder-dropdown mb-4">
            <label className="fw600 ff-heading mb-2">Rating</label>
            <div className="form-style2 input-group">
              {showSelect && (
                <Select
                  value={form.rating}
                  options={inqueryType}
                  styles={customStyles}
                  className="custom-react_select"
                  classNamePrefix="select"
                  required
                  isClearable={false}
                  isDisabled={submitting}
                  onChange={(opt) => setField("rating", opt)}
                  onBlur={() => setTouched((p) => ({ ...p, rating: true }))}
                />
              )}
            </div>
            {touched.rating && errors.rating ? (
              <p style={{ color: "red", marginTop: 6, marginBottom: 0 }}>
                {errors.rating}
              </p>
            ) : null}
          </div>
        </div>

        <div className="col-md-12">
          <div className="mb-4">
            <label className="fw600 ff-heading mb-2">Review</label>
            <textarea
              className="pt15"
              rows={6}
              placeholder="Write a Review"
              value={form.review}
              onChange={(e) => setField("review", e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, review: true }))}
              required
              disabled={submitting}
            />
            {touched.review && errors.review ? (
              <p style={{ color: "red", marginTop: 6, marginBottom: 0 }}>
                {errors.review}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            className="ud-btn btn-white2"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
            <i className="fal fa-arrow-right-long" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReviewBoxForm;
