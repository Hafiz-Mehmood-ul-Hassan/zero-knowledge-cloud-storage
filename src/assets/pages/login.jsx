


// import { Link, useNavigate } from "react-router-dom";
// import React, { useState } from "react";
// import { API_BASE } from "../../config.js";

// /**
//  * Login with optional 2FA step.
//  * - POST /login/ -> either returns tokens OR { id, OTP_SENT:true } for 2FA
//  * - If 2FA -> POST /verify/ with { id, otp } to receive tokens
//  */
// export default function LoginPage({
//   postUrl = `${API_BASE}/login/`,
//   verifyUrl = `${API_BASE}/verify/`,   // ← same as signup verify
//   onSuccess = (data) => console.log("Logged in:", data),
// }) {
//   const navigate = useNavigate();

//   const [step, setStep] = useState("login"); // "login" | "otp"
//   const [username, setusername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [pendingId, setPendingId] = useState(null); // 2FA pending user/session id

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Common helper to save tokens + go dashboard
//   function completeLogin(data) {
//     const access = data?.token?.access;
//     const refresh = data?.token?.refresh;

//     if (!access) throw new Error("No access token in response.");
//     localStorage.setItem("access", access);
//     if (refresh) localStorage.setItem("refresh", refresh);

//     onSuccess(data);
//     navigate("/dashboard", { replace: true });
//   }

//   // Step 1: submit username/password
//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch(postUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) {
//         const msg =
//           data?.detail ||
//           data?.error ||
//           (typeof data === "string" ? data : "Login failed. Check credentials.");
//         throw new Error(msg);
//       }

//       // Case A: tokens directly (no 2FA)
//       if (data?.token?.access) {
//         completeLogin(data);
//         return;
//       }

      
//       // Case B: 2FA required → expect { id, OTP_SENT: true }
//       if (data?.id && data?.OTP_SENT) {
//         setPendingId(data.id);
//         setStep("otp");
//         return;
//       }

//       // Unknown shape
//       throw new Error("Unexpected response. Missing tokens or 2FA ID.");
//     } catch (err) {
//       setError(err.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Step 2: submit OTP to verifyUrl → expect tokens back
//   async function handleVerifyOtp(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch(verifyUrl, {
//         method: "POST",               // use POST here as in signup verify
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ id: pendingId, otp }),
//       });

//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) {
//         const msg = data?.error || data?.detail || "OTP verification failed";
//         throw new Error(msg);
//       }

//       // expect tokens now
//       completeLogin(data);
//     } catch (err) {
//       setError(err.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Brand */}
//         <div className="text-center mb-8">
//           <a
//             href="/"
//             className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-indigo-600 shadow-lg flex items-center justify-center text-white text-xl font-bold"
//           >
//             VX
//           </a>
//           <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
//             {step === "login" ? "Welcome back" : "Two-Factor Verification"}
//           </h1>
//           <p className="mt-2 text-sm text-slate-600">
//             {step === "login"
//               ? "Sign in to continue"
//               : "Enter the 6-digit code sent to your email"}
//           </p>
//         </div>

//         {/* Step indicator */}
//         <div className="mb-4 flex items-center justify-center gap-3 text-xs">
//           <StepDot active={step === "login"} label="Login" />
//           <div className="h-px w-10 bg-slate-300" />
//           <StepDot active={step === "otp"} label="OTP" />
//         </div>

//         {/* Card */}
//         <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-6 sm:p-8 shadow-xl">
//           {error && (
//             <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
//               {error}
//             </div>
//           )}

//           {step === "login" ? (
//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Username */}
//               <div>
//                 <label htmlFor="username" className="block text-sm font-medium text-slate-700">
//                   Username
//                 </label>
//                 <div className="mt-2 relative">
//                   <input
//                     id="username"
//                     name="username"
//                     type="text"
//                     autoComplete="username"
//                     required
//                     value={username}
//                     onChange={(e) => setusername(e.target.value)}
//                     className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pl-11 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     placeholder="you@example.com"
//                   />
//                   <span className="pointer-events-none absolute mt-3 inset-y-0 left-3 my-auto text-slate-400">👤</span>
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <div className="flex items-center justify-between">
//                   <label htmlFor="password" className="block text-sm font-medium text-slate-700">
//                     Password
//                   </label>
//                   <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
//                     Forgot?
//                   </Link>
//                 </div>
//                 <div className="mt-2 relative">
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     autoComplete="current-password"
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pl-11 pr-16 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     placeholder="••••••••"
//                   />
//                   <span className="pointer-events-none absolute mt-3 inset-y-0 left-3 my-auto text-slate-400">🔒</span>
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword((s) => !s)}
//                     className="absolute inset-y-0 right-2 my-auto h-9 px-3 rounded-lg text-sm text-slate-600 hover:bg-slate-100"
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                   >
//                     {showPassword ? "Hide" : "Show"}
//                   </button>
//                 </div>
//               </div>

//               {/* Remember me */}
//               <div className="flex items-center">
//                 <input
//                   id="remember"
//                   name="remember"
//                   type="checkbox"
//                   className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
//                 />
//                 <label htmlFor="remember" className="ml-2 block text-sm text-slate-700">
//                   Remember me
//                 </label>
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full rounded-2xl bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 {loading ? "Signing in…" : "Sign in"}
//               </button>
//             </form>
//           ) : (
//             <form onSubmit={handleVerifyOtp} className="space-y-5">
//               <div>
//                 <label htmlFor="otp" className="block text-sm font-medium text-slate-700">
//                   6-digit OTP
//                 </label>
//                 <input
//                   id="otp"
//                   name="otp"
//                   type="text"
//                   inputMode="numeric"
//                   maxLength={6}
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   required
//                   className="mt-2 block w-full text-center tracking-widest rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="••••••"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full rounded-2xl bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 {loading ? "Verifying…" : "Verify & Continue"}
//               </button>

//               <p className="text-xs text-slate-500 text-center">
//                 Didn’t get the code? Check spam or request again from your profile.
//               </p>
//             </form>
//           )}
//         </div>

//         {/* Bottom link */}
//         <p className="mt-8 text-center text-sm text-slate-600">
//           Don’t have an account?{" "}
//           <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// function StepDot({ active, label }) {
//   return (
//     <div className="flex items-center gap-2">
//       <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-indigo-600" : "bg-slate-300"}`} />
//       <span className={`text-slate-600 ${active ? "font-medium text-slate-900" : ""}`}>{label}</span>
//     </div>
//   );
// }


import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { API_BASE } from "../../config.js";

/**
 * Dribbble-style Login + OTP
 * - Logic same as before (login → optional OTP)
 * - Right hero panel with decorative shapes + animated cloud
 */
export default function LoginPage({
  postUrl = `${API_BASE}/login/`,
  verifyUrl = `${API_BASE}/verify/`,
  onSuccess = (data) => console.log("Logged in:", data),
  logoText = "VX",
}) {
  const navigate = useNavigate();

  // ---- State (same core logic) ----
  const [step, setStep] = useState("login"); // "login" | "otp"
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingId, setPendingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---- Helpers (unchanged) ----
  function completeLogin(data) {
    const access = data?.token?.access;
    const refresh = data?.token?.refresh;
    if (!access) throw new Error("No access token in response.");
    localStorage.setItem("access", access);
    if (refresh) localStorage.setItem("refresh", refresh);
    onSuccess(data);
    navigate("/dashboard", { replace: true });
  }

  // Step 1: username/password
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          data?.detail ||
          data?.error ||
          (typeof data === "string" ? data : "Login failed. Check credentials.");
        throw new Error(msg);
      }

      // Case A: tokens (no 2FA)
      if (data?.token?.access) {
        completeLogin(data);
        return;
      }
      // Case B: 2FA prompt
      if (data?.id && data?.OTP_SENT) {
        setPendingId(data.id);
        setStep("otp");
        return;
      }

      // Unknown shape
      throw new Error("Unexpected response. Missing tokens or 2FA ID.");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // Step 2: OTP verify
  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(verifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: pendingId, otp }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.error || data?.detail || "OTP verification failed";
        throw new Error(msg);
      }

      completeLogin(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-violet-100" />

      {/* Soft blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-[#A18CFF] to-[#6E63FF] opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-[#6E63FF] to-[#2713DB] opacity-25 blur-3xl" />

      {/* Content grid */}
      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 lg:grid-cols-2">
        {/* LEFT: Auth card */}
        <div className="order-2 flex items-center justify-center p-6 lg:order-1">
          <div className="w-full max-w-md">
            {/* Brand */}
            <div className="mb-8 text-center">
              <a
                href="/"
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-300/40"
              >
                <span className="text-lg font-extrabold">{logoText}</span>
              </a>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {step === "login" ? "Welcome back" : "Two-Factor Verification"}
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                {step === "login" ? "Sign in to continue" : "Enter the 6-digit code sent to your email"}
              </p>
            </div>

            {/* Step indicator */}
            <div className="mb-4 flex items-center justify-center gap-3 text-xs">
              <StepDot active={step === "login"} label="Login" />
              <div className="h-px w-10 bg-slate-300" />
              <StepDot active={step === "otp"} label="OTP" />
            </div>

            {/* Card */}
            <div className="rounded-3xl border border-white/30 bg-white/70 p-6 shadow-2xl shadow-indigo-200/50 backdrop-blur-xl sm:p-8 transition-all">
              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {step === "login" ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* User Name */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                      User Name
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        value={username}
                        onChange={(e) => setusername(e.target.value)}
                        className="peer w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-3 pl-12 text-slate-900 placeholder:text-slate-400 outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60 focus:shadow-[0_10px_30px_rgba(99,102,241,0.12)]"
                        placeholder="User Name"
                      />
                      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <MailIcon className="h-5 w-5 text-slate-400 peer-focus:text-indigo-500" />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                        Password
                      </label>
                      <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        Forgot?
                      </Link>
                    </div>
                    <div className="relative mt-2">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="peer w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-3 pl-12 pr-20 text-slate-900 placeholder:text-slate-400 outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60 focus:shadow-[0_10px_30px_rgba(99,102,241,0.12)]"
                        placeholder="Password"
                      />
                      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <LockIcon className="h-5 w-5 text-slate-400 peer-focus:text-indigo-500" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute inset-y-0 right-2 my-auto h-9 rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 active:scale-[.98]"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* Remember me */}
                  <div className="flex items-center">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-slate-700">
                      Remember me
                    </label>
                  </div>

                  {/* Submit */}
                 <button
  type="submit"
  disabled={loading}
  className="group relative w-full transform overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium shadow-md animate-pulse px-4 py-2"
>
  <span className="flex items-center justify-center gap-2 text-base">
    {loading ? <Spinner /> : <ArrowRight className="h-4 w-4 opacity-90" />}
    {loading ? "Signing in…" : "Sign in"}
  </span>
</button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-slate-700">
                      6-digit OTP
                    </label>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="mt-2 block w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-3 text-center text-lg tracking-[0.6em] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60 focus:shadow-[0_10px_30px_rgba(99,102,241,0.12)]"
                      placeholder="• • • • • •"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full transform overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 font-semibold text-white shadow-md transition hover:scale-[1.01] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[.99]"
                  >
                    <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-white/20 blur-md transition group-hover:translate-x-[120%]" />
                    <span className="flex items-center justify-center gap-2">
                      {loading ? <Spinner /> : <ShieldCheck className="h-5 w-5 opacity-90" />}
                      {loading ? "Verifying…" : "Verify & Continue"}
                    </span>
                  </button>

                  <p className="text-center text-xs text-slate-500">
                    Didn’t get the code? Check spam or request again from your profile.
                  </p>
                </form>
              )}
            </div>

            {/* Bottom link */}
            <p className="mt-8 text-center text-sm text-slate-600">
              Don’t have an account?{" "}
              <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT: Hero / Animation panel */}
        <div className="order-1 hidden items-center justify-center p-8 lg:order-2 lg:flex">
          <div className="relative h-[520px] w-full max-w-[520px]">
            {/* Glass frame */}
            <div className="absolute inset-0 rounded-[2rem] border border-white/20 bg-white/20 shadow-2xl backdrop-blur-2xl" />
            {/* Accent glow */}
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-[#8B7BD1] via-[#4920E1] to-[#0C08A9] opacity-20 blur-3xl" />
            {/* Decorative canvas with animated cloud */}
            <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden rounded-[2rem] bg-white/10">
              <DecorativeShapes />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small UI bits ---------- */

function StepDot({ active, label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-2.5 w-2.5 rounded-full transition ${
          active ? "bg-indigo-600 shadow-[0_0_0_4px_rgba(99,102,241,0.25)]" : "bg-slate-300"
        }`}
      />
      <span className={`text-slate-600 ${active ? "font-medium text-slate-900" : ""}`}>{label}</span>
    </div>
  );
}

function MailIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l9 6 9-6M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
    </svg>
  );
}

function LockIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 10-8 0v4m-2 0h12v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8z" />
    </svg>
  );
}

function ArrowRight({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function ShieldCheck({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z" />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  );
}

function Spinner({ className = "h-5 w-5" }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  );
}

/* ---------- Decorative Hero (centered cloud + rotating arc + reflection visible) ---------- */
function DecorativeShapes() {
  return (
    <div className="relative h-full w-full">
      <style>{`
        @keyframes spin-arc {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes cloud-float-press {
          0%,100% { transform: translateY(0) scale(1,1); }
          50%     { transform: translateY(-8px) scale(1.05,.95); }
        }
        @keyframes cloud-tint {
          0%   { background: #E7EBF2; }
          50%  { background: #FFFFFF; }
          100% { background: #E7EBF2; }
        }
        @keyframes blue-pulse {
          0%   { transform: scale(0.92); opacity: .52; }
          50%  { transform: scale(1.08); opacity: .9; }
          100% { transform: scale(0.92); opacity: .52; }
        }

        .arcSpin     { animation: spin-arc 7s linear infinite; }
        .cloudMotion { animation: cloud-float-press 3.6s ease-in-out infinite; }
        .cloudTint   { animation: cloud-tint 3.6s ease-in-out infinite; }
        .bluePulse   { animation: blue-pulse 2.8s ease-in-out infinite; }
      `}</style>

      {/* INNER CIRCLE */}
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-2xl flex items-center justify-center overflow-visible">
        {/* gradient disk */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600" />
        <div className="absolute inset-0 rounded-full ring-1 ring-white/25" />

        {/* static outer ring */}
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-neutral-800/80 shadow-[0_0_22px_rgba(0,0,0,0.18)]" />

        {/* rotating arc */}
        <div
          className="arcSpin absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'conic-gradient(from 0deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,0) 320deg, rgba(255,255,255,0.9) 340deg, rgba(255,255,255,0.4) 360deg)',
            WebkitMask:
              'radial-gradient(circle, transparent 78%, black 79%, black 100%)',
            mask:
              'radial-gradient(circle, transparent 78%, black 79%, black 100%)',
            filter: 'blur(0.5px)',
            mixBlendMode: 'screen',
          }}
        />

        {/* blue reflection / glow (visible again) */}
        <div
          className="bluePulse absolute h-72 w-72 rounded-full -z-10"
          style={{
            background:
              'radial-gradient(circle, rgba(59,130,246,0.35), rgba(59,130,246,0.15) 70%, transparent 80%)',
          }}
        />

        {/* CLOUD perfectly centered */}
        <div className="relative flex items-center justify-center cloudMotion">
          <div className="relative h-14 w-28 rounded-full cloudTint">
            <div className="absolute -top-4 left-6 h-12 w-12 rounded-full cloudTint" />
            <div className="absolute -top-3 right-6 h-10 w-10 rounded-full cloudTint" />
            <div className="absolute bottom-0 left-1/2 h-3 w-[78%] -translate-x-1/2 rounded-b-full bg-neutral-300/85" />
            <div className="absolute left-4 top-2 h-10 w-20 rounded-full bg-white/60 blur-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
