// import { API_BASE } from "../../config.js";

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Signup() {
//   const navigate = useNavigate();

//   const [step, setStep] = useState(1); // 1 = Register, 2 = OTP
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [showPwd, setShowPwd] = useState(false);
//   const [showPwd2, setShowPwd2] = useState(false);

//   const [otp, setOtp] = useState("");
//   const [userId, setUserId] = useState(null);

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   async function handleRegister(e) {
//     e.preventDefault();
//     setError("");

//     if (form.password !== form.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/register/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           username: form.username,
//           email: form.email,
//           password: form.password,
//         }),
//       });

//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data?.error || "Registration failed");

//       if (data.OTP_SENT) {
//         setUserId(data.id);
//         setStep(2);
//       } else {
//         throw new Error("OTP not sent");
//       }
//     } catch (err) {
//       setError(err.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleVerifyOtp(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/verify/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id: userId, otp }),
//       });

//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data?.error || "OTP verification failed");

//       // success → alert + redirect to login
//       alert(`✅ Registration complete! ${data.message || ""}`);
//       navigate("/login", { replace: true });
//     } catch (err) {
//       setError(err.message || "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-50 px-4">
//       <div className="w-full max-w-md">
//         {/* Brand */}
//         <div className="text-center mb-8 mt-4">
//           <a href="/" className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-indigo-600 shadow-lg flex items-center justify-center text-white text-xl font-bold">
//             VX
//             </a> 
//           <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create your account</h1>
//           <p className="mt-2 text-sm text-slate-600">It takes less than a minute</p>
//         </div>

//         {/* Step indicator */}
//         <div className="mb-4 flex items-center justify-center gap-3 text-xs">
//           <StepDot active={step === 1} label="Register" />
//           <div className="h-px w-10 bg-slate-300" />
//           <StepDot active={step === 2} label="Verify OTP" />
//         </div>

//         {/* Card */}
//         <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-6 sm:p-8 shadow-xl">
//           {error && (
//             <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
//               {error}
//             </div>
//           )}

//           {step === 1 ? (
//             <form onSubmit={handleRegister} className="space-y-5">
//               {/* Email */}
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-slate-700">
//                   Email
//                 </label>
//                 <div className="mt-2 relative">
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     value={form.email}
//                     onChange={handleChange}
//                     required
//                     className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pl-11 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     placeholder="you@example.com"
//                   />
//                   <span className="pointer-events-none mt-3 absolute inset-y-0 left-3 my-auto text-slate-400">✉️</span>
//                 </div>
//               </div>

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
//                     value={form.username}
//                     onChange={handleChange}
//                     required
//                     className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pl-11 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     placeholder="yourusername"
//                   />
//                   <span className="pointer-events-none mt-3 absolute inset-y-0 left-3 my-auto text-slate-400">👤</span>
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-slate-700">
//                   Password
//                 </label>
//                 <div className="mt-2 relative">
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPwd ? "text" : "password"}
//                     value={form.password}
//                     onChange={handleChange}
//                     required
//                     className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pl-11 pr-16 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     placeholder="••••••••"
//                   />
//                   <span className="pointer-events-none absolute mt-3 inset-y-0 left-3 my-auto text-slate-400">🔒</span>
//                   <button
//                     type="button"
//                     onClick={() => setShowPwd((s) => !s)}
//                     className="absolute inset-y-0 right-2 my-auto h-9 px-3 rounded-lg text-sm text-slate-600 hover:bg-slate-100"
//                   >
//                     {showPwd ? "Hide" : "Show"}
//                   </button>
//                 </div>
//               </div>

//               {/* Confirm Password */}
//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
//                   Re-enter Password
//                 </label>
//                 <div className="mt-2 relative">
//                   <input
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type={showPwd2 ? "text" : "password"}
//                     value={form.confirmPassword}
//                     onChange={handleChange}
//                     required
//                     className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pl-11 pr-16 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     placeholder="••••••••"
//                   />
//                   <span className="pointer-events-none mt-3 absolute inset-y-0 left-3 my-auto text-slate-400">🔒</span>
//                   <button
//                     type="button"
//                     onClick={() => setShowPwd2((s) => !s)}
//                     className="absolute inset-y-0 right-2 my-auto h-9 px-3 rounded-lg text-sm text-slate-600 hover:bg-slate-100"
//                   >
//                     {showPwd2 ? "Hide" : "Show"}
//                   </button>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full rounded-2xl bg-indigo-600 px-4 py-2.5 font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 {loading ? "Registering..." : "Register"}
//               </button>

//               {/* Hint */}
//               <p className="text-xs text-slate-500">
//                 You’ll receive a 6-digit OTP at <span className="font-medium">{form.email || "your email"}</span>.
//               </p>
//             </form>
//           ) : (
//             <form onSubmit={handleVerifyOtp} className="space-y-5">
//               <div className="text-center">
//                 <h2 className="text-xl font-semibold text-slate-900">Verify OTP</h2>
//                 <p className="text-sm text-slate-600 mt-1">
//                   Enter the 6-digit code sent to <span className="font-medium">{form.email}</span>
//                 </p>
//               </div>

//               <div className="mt-2">
//                 <label htmlFor="otp" className="block text-sm font-medium text-slate-700">
//                   6-digit OTP
//                 </label>
//                 <input
//                   id="otp"
//                   name="otp"
//                   type="text"
//                   maxLength="6"
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
//                 className="w-full rounded-2xl bg-emerald-600 px-4 py-2.5 font-semibold text-white shadow-md hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 {loading ? "Verifying..." : "Verify OTP"}
//               </button>

//               <p className="text-xs text-slate-500 text-center">
//                 Didn’t get the code? Check spam or wait a minute before retrying.
//               </p>
//             </form>
//           )}
//         </div>

//         <p className="mt-8 text-center text-sm text-slate-600">
//           Already have an account?{" "}
//           <button
//             type="button"
//             onClick={() => navigate("/login")}
//             className="font-semibold text-indigo-600 hover:text-indigo-500"
//           >
//             Log in
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

// function StepDot({ active, label }) {
//   return (
//     <div className="flex items-center gap-2">
//       <span
//         className={`h-2.5 w-2.5 rounded-full ${active ? "bg-indigo-600" : "bg-slate-300"}`}
//         aria-hidden
//       />
//       <span className={`text-slate-600 ${active ? "font-medium text-slate-900" : ""}`}>{label}</span>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../../config.js";

export default function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = Register, 2 = OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Registration failed");

      if (data?.OTP_SENT && data?.id) {
        setUserId(data.id);
        setStep(2);
      } else {
        throw new Error("OTP not sent");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/verify/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, otp }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "OTP verification failed");

      alert(`✅ Registration complete! ${data?.message || ""}`);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-violet-100" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-[#A18CFF] to-[#6E63FF] opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-[#6E63FF] to-[#2713DB] opacity-25 blur-3xl" />

      {/* Grid */}
      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 lg:grid-cols-2">
        {/* LEFT: Signup card */}
        <div className="order-2 flex items-center justify-center p-6 lg:order-1">
          <div className="w-full max-w-md">
            {/* Brand */}
            <div className="mb-8 text-center">
              <a
                href="/"
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-300/40"
              >
                <span className="text-lg font-extrabold">VX</span>
              </a>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {step === 1 ? "Create your account" : "Verify your email"}
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                {step === 1
                  ? "It takes less than a minute"
                  : `Enter the 6-digit OTP sent to ${form.email || "your email"}`}
              </p>
            </div>

            {/* Step indicator */}
            <div className="mb-4 flex items-center justify-center gap-3 text-xs">
              <StepDot active={step === 1} label="Register" />
              <div className="h-px w-10 bg-slate-300" />
              <StepDot active={step === 2} label="OTP" />
            </div>

            {/* Card */}
            <div className="rounded-3xl border border-white/30 bg-white/70 p-6 shadow-2xl shadow-indigo-200/50 backdrop-blur-xl sm:p-8">
              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {step === 1 ? (
                <form onSubmit={handleRegister} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="peer w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-3 pl-12 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60"
                        placeholder="you@example.com"
                      />
                      {/* Centered emoji */}
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <span className="grid h-6 w-6 place-items-center text-[18px] leading-none translate-y-[1px]">✉️</span>
                      </span>
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                      Username
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="peer w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-3 pl-12 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60"
                        placeholder="yourusername"
                      />
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <span className="grid h-6 w-6 place-items-center text-[18px] leading-none translate-y-[1px]">👤</span>
                      </span>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="password"
                        name="password"
                        type={showPwd ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="peer w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-3 pl-12 pr-20 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60"
                        placeholder="••••••••"
                      />
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <span className="grid h-6 w-6 place-items-center text-[18px] leading-none translate-y-[1px]">🔒</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowPwd((s) => !s)}
                        className="absolute inset-y-0 right-2 my-auto h-9 rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 active:scale-[.98]"
                        aria-label={showPwd ? "Hide password" : "Show password"}
                      >
                        {showPwd ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                      Re-enter Password
                    </label>
                    <div className="relative mt-2">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPwd2 ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        className="peer w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-3 pl-12 pr-20 text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60"
                        placeholder="••••••••"
                      />
                      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <span className="grid h-6 w-6 place-items-center text-[18px] leading-none translate-y-[1px]">🔒</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowPwd2((s) => !s)}
                        className="absolute inset-y-0 right-2 my-auto h-9 rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 active:scale-[.98]"
                        aria-label={showPwd2 ? "Hide password" : "Show password"}
                      >
                        {showPwd2 ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full transform overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-white font-medium shadow-md animate-pulse disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center justify-center gap-2 text-base">
                      {loading ? "Registering…" : "Register"}
                    </span>
                  </button>

                  <p className="text-xs text-slate-500">
                    You’ll receive a 6-digit OTP at{" "}
                    <span className="font-medium">{form.email || "your email"}</span>.
                  </p>
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
                      className="mt-2 block w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-3 text-center text-lg tracking-[0.6em] text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60"
                      placeholder="• • • • • •"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full transform overflow-hidden rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-white font-medium shadow-md animate-pulse disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center justify-center gap-2 text-base">
                      {loading ? "Verifying…" : "Verify & Continue"}
                    </span>
                  </button>

                  <p className="text-center text-xs text-slate-500">
                    Didn’t get the code? Check spam or wait a minute before retrying.
                  </p>
                </form>
              )}
            </div>

            {/* Bottom link */}
            <p className="mt-8 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT: Hero / Animation panel */}
        <div className="order-1 hidden items-center justify-center p-8 lg:order-2 lg:flex">
          <div className="relative h-[520px] w-full max-w-[520px]">
            <div className="absolute inset-0 rounded-[2rem] border border-white/20 bg-white/20 shadow-2xl backdrop-blur-2xl" />
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-[#8B7BD1] via-[#4920E1] to-[#0C08A9] opacity-20 blur-3xl" />
            <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden rounded-[2rem] bg-white/10">
              <DecorativeShapes />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small UI bit ---------- */
function StepDot({ active, label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          active ? "bg-indigo-600" : "bg-slate-300"
        }`}
      />
      <span className={`text-slate-600 ${active ? "font-medium text-slate-900" : ""}`}>
        {label}
      </span>
    </div>
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

      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-2xl flex items-center justify-center overflow-visible">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600" />
        <div className="absolute inset-0 rounded-full ring-1 ring-white/25" />

        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-neutral-800/80 shadow-[0_0_22px_rgba(0,0,0,0.18)]" />

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

        <div
          className="bluePulse absolute h-72 w-72 rounded-full -z-10"
          style={{
            background:
              'radial-gradient(circle, rgba(59,130,246,0.35), rgba(59,130,246,0.15) 70%, transparent 80%)',
          }}
        />

        {/* Cloud (centered) */}
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
