
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { API_BASE } from "../../config.js";
export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState("username"); // "username" | "otp" | "done"
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPwd, setShowNewPwd] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [emailHint, setEmailHint] = useState("");

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/reset_password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.OTP_SENT) {
        setId(data.id);
        setEmailHint(data.email); // e.g., ***@gmail.com (from backend)
        setStep("otp");
      } else {
        setError(data?.error || "Something went wrong");
      }
    } catch {
      setError("Network error");
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (otp.trim().length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/verify/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, otp, password: newPassword }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage(data?.message || "Password reset successfully!");
        setStep("done");
      } else {
        setError(data?.error || "Invalid OTP or request");
      }
    } catch {
      setError("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-indigo-600 shadow-lg flex items-center justify-center text-white text-xl font-bold">
            VX
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Forgot Password
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            We’ll send a 6-digit code to your email
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-4 flex items-center justify-center gap-3 text-xs">
          <StepDot active={step === "username"} label="Username" />
          <div className="h-px w-10 bg-slate-300" />
          <StepDot active={step === "otp"} label="Verify OTP" />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-6 sm:p-8 shadow-xl">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              ❌ {error}
            </div>
          )}

          {step === "username" && (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                  Username
                </label>
                <div className="mt-2 relative">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pl-11 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="yourusername"
                  />
                  <span className="pointer-events-none mt-3 absolute inset-y-0 left-3 my-auto text-slate-400">
                    👤
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Send OTP
              </button>

              <p className="text-xs text-slate-500 text-center">
                We’ll email a verification code to your registered address.
              </p>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-slate-900">Verify & Reset</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Code sent to <span className="font-medium">{emailHint || "your email"}</span>
                </p>
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-slate-700">
                  6-digit OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="mt-2 block w-full text-center tracking-widest rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="••••••"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">
                  New password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="newPassword"
                    type={showNewPwd ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pr-16 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPwd((s) => !s)}
                    className="absolute inset-y-0 right-2 my-auto h-9 px-3 rounded-lg text-sm text-slate-600 hover:bg-slate-100"
                  >
                    {showNewPwd ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-emerald-600 px-4 py-2.5 font-semibold text-white shadow-md hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                Verify & Reset
              </button>
            </form>
          )}

          {step === "done" && (
            <div className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <div className="font-medium text-emerald-700">{message}</div>
              <button
                type="button"
                onClick={() => navigate("/login", { replace: true })}
                className="mt-4 rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          Remembered your password?{" "}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

function StepDot({ active, label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-2.5 w-2.5 rounded-full ${active ? "bg-indigo-600" : "bg-slate-300"}`}
        aria-hidden
      />
      <span className={`text-slate-600 ${active ? "font-medium text-slate-900" : ""}`}>{label}</span>
    </div>
  );
}
