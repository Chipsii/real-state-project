"use client";

import React from "react";
import Link from "next/link";


export default function SuccessDone({ onReset }) {
  return (
    <div className="mt-4 text-center">
      {/* Success message */}
      <div className="alert alert-success mb-4" role="status">
        <div className="fw-semibold mb-1">Password updated</div>
        <div className="small">
          Your password has been updated successfully. You can now log in with your new password.
        </div>
      </div>

      {/* Primary action */}
      <Link href="/login" className="btn btn-dark w-100 mb-3">
        Go to login
      </Link>
    </div>
  );
}
