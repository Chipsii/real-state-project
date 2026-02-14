"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  requestPasswordReset,
  verifyPasswordResetOtp,
  confirmPasswordReset,
} from "@/services/auth/api";

import StepRequest from "./stepRequest";
import StepVerifyOtp from "./stepVerifyOtp";
import StepNewPassword from "./stepNewPassword";
import SuccessDone from "./successDone";
import { isValidEmail, maskEmail, passwordOk } from "./helpers";


export default function ForgotPasswordFlow() {
  const [step, setStep] = useState("request");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // resend cooldown
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef(null);

  const emailOk = useMemo(() => isValidEmail(email), [email]);
  const otpOk = useMemo(() => /^\d{4,8}$/.test(otp.trim()), [otp]);
  const pwOk = useMemo(() => passwordOk(newPassword), [newPassword]);
  const pwMatch = useMemo(
    () => newPassword.length > 0 && newPassword === confirmNewPassword,
    [newPassword, confirmNewPassword]
  );

  function show(type, msg) {
    setToast({ type, msg });
    window.setTimeout(() => setToast(null), 5000);
  }

  useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = window.setInterval(() => {
      setCooldown((c) => (c <= 1 ? 0 : c - 1));
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [cooldown]);

  async function onRequest() {
    if (!emailOk) return;
    setLoading(true);
    setToast(null);
    try {
      await requestPasswordReset({ email: email.trim().toLowerCase() });
      setStep("verify");
      setOtp("");
      setResetToken(null);
      setCooldown(30);
      show("success", `OTP sent to ${maskEmail(email.trim())}.`);
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        "Could not request reset. Please try again.";
      show("error", msg);
    } finally {
      setLoading(false);
    }
  }

  async function onVerifyOtp() {
    if (!emailOk || !otpOk) return;
    setLoading(true);
    setToast(null);
    try {
      const {resetToken}= await verifyPasswordResetOtp({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });
      if (!resetToken) {
        show("error", "OTP verified but no reset token was returned by the server.");
        return;
      }

      setResetToken(resetToken);
      setStep("confirm");
      setNewPassword("");
      setConfirmNewPassword("");
      show("success", "OTP verified. Set your new password.");
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        "Invalid OTP or OTP expired. Please try again.";
      show("error", msg);
    } finally {
      setLoading(false);
    }
  }

  async function onConfirmNewPassword() {
    if (!resetToken) {
      show("error", "Missing reset token. Please verify OTP again.");
      setStep("verify");
      return;
    }
    if (!pwOk || !pwMatch) return;

    setLoading(true);
    setToast(null);
    try {
      await confirmPasswordReset({ resetToken, newPassword });
      setStep("done");
      setResetToken(null);
      setOtp("");
      setNewPassword("");
      setConfirmNewPassword("");
      show("success", "Password updated successfully. You can log in now.");
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        "Could not reset password. Please try again.";
      show("error", msg);
    } finally {
      setLoading(false);
    }
  }

  async function onResendOtp() {
    if (!emailOk || cooldown > 0) return;
    setLoading(true);
    setToast(null);
    try {
      await requestPasswordReset({ email: email.trim().toLowerCase() });
      setCooldown(30);
      show("success", `OTP resent to ${maskEmail(email.trim())}.`);
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        "Could not resend OTP. Please try again.";
      show("error", msg);
    } finally {
      setLoading(false);
    }
  }

  function resetAll() {
    setStep("request");
    setEmail("");
    setOtp("");
    setResetToken(null);
    setNewPassword("");
    setConfirmNewPassword("");
    setToast(null);
    setCooldown(0);
  }
const banner = toast ? (
  <div
    className={[
      "alert mb-0",
      toast.type === "success" ? "alert-success" : "",
      toast.type === "error" ? "alert-danger" : "",
      toast.type === "info" ? "alert-info" : "",
    ].join(" ")}
    role={toast.type === "error" ? "alert" : "status"}
    aria-live="polite"
  >
    {toast.msg}
  </div>
) : null;

const stepNum =
  step === "request" ? "1" : step === "verify" ? "2" : step === "confirm" ? "3" : "✓";

return (
  <main className="min-vh-100 d-flex align-items-center justify-content-center p-3">
    <div className="card shadow-sm w-100" style={{ maxWidth: 420 }}>
      <div className="card-body p-4">
        <div className="d-flex align-items-start justify-content-between gap-3">
          <div>
            <h1 className="h4 fw-semibold mb-2">Forgot password</h1>
            <p className="text-muted small mb-0">
              {step === "request" && "Enter your email to receive an OTP."}
              {step === "verify" && "Enter the OTP sent to your email."}
              {step === "confirm" && "Create a new password for your account."}
              {step === "done" && "Your password has been updated."}
            </p>
          </div>

          <div className="text-muted small">
            Step <span className="fw-semibold">{stepNum}</span> / 3
          </div>
        </div>

        {toast && <div className="mt-3">{banner}</div>}

        {step === "request" && (
          <div className="mt-4">
            <StepRequest
              email={email}
              setEmail={setEmail}
              emailOk={emailOk}
              loading={loading}
              onSubmit={onRequest}
            />
          </div>
        )}

        {step === "verify" && (
          <div className="mt-4">
            <StepVerifyOtp
              email={email}
              otp={otp}
              setOtp={setOtp}
              otpOk={otpOk}
              loading={loading}
              cooldown={cooldown}
              onSubmit={onVerifyOtp}
              onResend={onResendOtp}
              onChangeEmail={() => setStep("request")}
            />
          </div>
        )}

        {step === "confirm" && (
          <div className="mt-4">
            <StepNewPassword
              email={email}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmNewPassword={confirmNewPassword}
              setConfirmNewPassword={setConfirmNewPassword}
              pwOk={pwOk}
              pwMatch={pwMatch}
              loading={loading}
              onSubmit={onConfirmNewPassword}
              onBackToOtp={() => {
                setStep("verify");
                setNewPassword("");
                setConfirmNewPassword("");
              }}
            />
          </div>
        )}

        {step === "done" && (
          <div className="mt-4">
            <SuccessDone onReset={resetAll} />
          </div>
        )}
      </div>
    </div>
  </main>
);
}