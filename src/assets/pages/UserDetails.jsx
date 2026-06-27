// // src/assets/pages/UserDetails.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { API_BASE } from "../../config.js";

// export default function UserDetails() {
//   const navigate = useNavigate();
//   const access = localStorage.getItem("access");

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [okMsg, setOkMsg] = useState("");

//   const [user, setUser] = useState({
//     id: null,
//     username: "",
//     email: "",
//     two_factor_enabled: false,
//     email_verified: false,
//   });

//   // 2FA saving / password changing / deletion flags
//   const [saving2fa, setSaving2fa] = useState(false);
//   const [changingPass, setChangingPass] = useState(false);
//   const [deleting, setDeleting] = useState(false);

//   // Change password form
//   const [curPass, setCurPass] = useState("");
//   const [newPass, setNewPass] = useState("");
//   const [againPass, setAgainPass] = useState("");

//   async function load() {
//     setLoading(true);
//     setError("");
//     setOkMsg("");
//     try {
//       const res = await fetch(`${API_BASE}/userdetails/`, {
//         headers: { Accept: "application/json", Authorization: `Bearer ${access}` },
//       });
//       if (res.status === 401) { navigate("/login", { replace: true }); return; }
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.detail || data?.error || "Failed to load user");

//       setUser({
//         id: data.id ?? null,
//         username: data.username ?? "",
//         email: data.email ?? "",
//         two_factor_enabled: !!data.two_factor_enabled,
//         email_verified: !!data.email_verified,
//       });
//     } catch (e) {
//       setError(e.message || "Network error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (!access) { navigate("/login", { replace: true }); return; }
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   async function toggle2FA(nextVal) {
//     setSaving2fa(true);
//     setError(""); setOkMsg("");
//     try {
//       const res = await fetch(`${API_BASE}/userdetails/`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
//         body: JSON.stringify({ two_factor_enabled: nextVal }),
//       });
//       const data = await res.json().catch(() => ({}));
//       if (res.status === 401) { navigate("/login", { replace: true }); return; }
//       if (!res.ok) throw new Error(data?.detail || data?.error || "Failed to update 2FA");

//       setUser((u) => ({ ...u, two_factor_enabled: nextVal }));
//       setOkMsg(nextVal ? "Two-factor enabled." : "Two-factor disabled.");
//     } catch (e) {
//       setError(e.message || "Network error");
//     } finally {
//       setSaving2fa(false);
//     }
//   }

//   async function changePassword(e) {
//     e.preventDefault();
//     setError(""); setOkMsg("");

//     if (!curPass || !newPass || !againPass) {
//       setError("Please fill all password fields.");
//       return;
//     }
//     if (newPass !== againPass) {
//       setError("New password and confirmation do not match.");
//       return;
//     }
//     if (newPass.length < 8) {
//       setError("New password must be at least 8 characters.");
//       return;
//     }

//     setChangingPass(true);
//     try {
//       const res = await fetch(`${API_BASE}/userdetails/`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
//         body: JSON.stringify({ current_password: curPass, new_password: newPass }),
//       });
//       const data = await res.json().catch(() => ({}));
//       if (res.status === 401) { navigate("/login", { replace: true }); return; }
//       if (!res.ok) throw new Error(data?.detail || data?.error || "Failed to change password");

//       setCurPass(""); setNewPass(""); setAgainPass("");
//       setOkMsg("Password changed successfully.");
//     } catch (e) {
//       setError(e.message || "Network error");
//     } finally {
//       setChangingPass(false);
//     }
//   }

//   async function deleteAccount() {
//     if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

//     setDeleting(true);
//     setError(""); setOkMsg("");
//     try {
//     //   const url = user.id ? `${API_BASE}/userdetails/${user.id}/` : `${API_BASE}/userdetails/`;
//       const res = await fetch(`${API_BASE}/userdetails/`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${access}` },
//       });
//       if (res.status === 401) { navigate("/login", { replace: true }); return; }
//       if (!res.ok && res.status !== 204) {
//         const data = await res.json().catch(() => ({}));
//         throw new Error(data?.detail || data?.error || "Delete failed");
//       }

//       // logout locally
//       localStorage.removeItem("access");
//       localStorage.removeItem("refresh");
//       navigate("/login", { replace: true });
//     } catch (e) {
//       setError(e.message || "Network error");
//     } finally {
//       setDeleting(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50">
//       <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
//         <div className="mx-auto max-w-3xl px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <button onClick={() => navigate(-1)} className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50">
//               ← Back
//             </button>
//             <h1 className="font-semibold text-lg text-slate-900">User Details</h1>
//           </div>
//           <div className="flex items-center gap-2">
//             <button onClick={load} className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">
//               Refresh
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
//         {error && (
//           <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
//         )}
//         {okMsg && (
//           <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{okMsg}</div>
//         )}

//         {/* Profile Card */}
//         <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <h2 className="font-semibold text-slate-900">Profile</h2>
//           <div className="mt-3 grid gap-2 text-sm">
//             <div><span className="text-slate-500">Username:</span> <span className="font-medium">{loading ? "…" : user.username}</span></div>
//             <div><span className="text-slate-500">Email:</span> <span className="font-medium">{loading ? "…" : user.email}</span></div>
//             <div>
//               <span className="text-slate-500">Email verified:</span>{" "}
//               {loading ? "…" : (
//                 user.email_verified ? (
//                   <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-emerald-700">● verified</span>
//                 ) : (
//                   <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-amber-700">○ not verified</span>
//                 )
//               )}
//             </div>
//           </div>

//           {/* 2FA toggle */}
//           <div className="mt-5 flex items-center justify-between border-t pt-4">
//             <div>
//               <div className="font-medium text-slate-900">Two-Factor Authentication</div>
//               <div className="text-xs text-slate-500">Enable/disable from here. (PUT {API_BASE}/userdetails/)</div>
//             </div>
//             <button
//               onClick={() => toggle2FA(!user.two_factor_enabled)}
//               disabled={saving2fa || loading}
//               className={`rounded-xl px-4 py-2 text-sm border ${
//                 user.two_factor_enabled
//                   ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500"
//                   : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
//               } disabled:opacity-60`}
//             >
//               {saving2fa ? "Saving…" : user.two_factor_enabled ? "Disable 2FA" : "Enable 2FA"}
//             </button>
//           </div>
//         </section>

//         {/* Change password */}
//         <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//           <h2 className="font-semibold text-slate-900">Change Password</h2>
//           <form onSubmit={changePassword} className="mt-4 grid gap-3 max-w-md">
//             <div>
//               <label className="block text-sm text-slate-700">Current password</label>
//               <input
//                 type="password"
//                 className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
//                 value={curPass}
//                 onChange={(e) => setCurPass(e.target.value)}
//                 required
//                 autoComplete="current-password"
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-slate-700">New password</label>
//               <input
//                 type="password"
//                 className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
//                 value={newPass}
//                 onChange={(e) => setNewPass(e.target.value)}
//                 required
//                 autoComplete="new-password"
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-slate-700">Re-enter new password</label>
//               <input
//                 type="password"
//                 className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
//                 value={againPass}
//                 onChange={(e) => setAgainPass(e.target.value)}
//                 required
//                 autoComplete="new-password"
//               />
//             </div>

//             <div className="pt-2">
//               <button
//                 type="submit"
//                 disabled={changingPass}
//                 className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-500 disabled:opacity-60"
//               >
//                 {changingPass ? "Changing…" : "Change Password"}
//               </button>
//             </div>
//           </form>
//         </section>

//         {/* Danger zone */}
//         <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-semibold text-rose-700">Danger Zone</h3>
//                 <p className="text-xs text-rose-600">This will permanently delete your account.</p>
//               </div>
//               <button
//                 onClick={deleteAccount}
//                 disabled={deleting}
//                 className="rounded-xl border border-rose-400 bg-white px-4 py-2 text-sm text-rose-700 hover:bg-rose-100 disabled:opacity-60"
//               >
//                 {deleting ? "Deleting…" : "Delete Account"}
//               </button>
//             </div>
//         </section>
//       </main>
//     </div>
//   );
// }


// src/assets/pages/UserDetails.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../config.js";

export default function UserDetails() {
  const navigate = useNavigate();
  const access = localStorage.getItem("access");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const [user, setUser] = useState({
    id: null,
    username: "",
    email: "",
    two_factor_enabled: false,
    email_verified: false,
  });

  // Flags
  const [saving2fa, setSaving2fa] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Change password form
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [againPass, setAgainPass] = useState("");

  // Confirm modal for danger zone
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    setOkMsg("");
    try {
      const res = await fetch(`${API_BASE}/userdetails/`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${access}` },
      });
      if (res.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || data?.error || "Failed to load user");
      setUser({
        id: data.id ?? null,
        username: data.username ?? "",
        email: data.email ?? "",
        two_factor_enabled: !!data.two_factor_enabled,
        email_verified: !!data.email_verified,
      });
    } catch (e) {
      setError(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!access) {
      navigate("/login", { replace: true });
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggle2FA(nextVal) {
    setSaving2fa(true);
    setError("");
    setOkMsg("");
    try {
      const res = await fetch(`${API_BASE}/userdetails/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
        body: JSON.stringify({ two_factor_enabled: nextVal }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      if (!res.ok) throw new Error(data?.detail || data?.error || "Failed to update 2FA");
      setUser((u) => ({ ...u, two_factor_enabled: nextVal }));
      setOkMsg(nextVal ? "Two-factor enabled." : "Two-factor disabled.");
    } catch (e) {
      setError(e.message || "Network error");
    } finally {
      setSaving2fa(false);
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    setError("");
    setOkMsg("");

    if (!curPass || !newPass || !againPass) {
      setError("Please fill all password fields.");
      return;
    }
    if (newPass !== againPass) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (newPass.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setChangingPass(true);
    try {
      const res = await fetch(`${API_BASE}/userdetails/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
        body: JSON.stringify({ current_password: curPass, new_password: newPass }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      if (!res.ok) throw new Error(data?.detail || data?.error || "Failed to change password");
      setCurPass("");
      setNewPass("");
      setAgainPass("");
      setOkMsg("Password changed successfully.");
    } catch (e) {
      setError(e.message || "Network error");
    } finally {
      setChangingPass(false);
    }
  }

  async function deleteAccount() {
    setDeleting(true);
    setError("");
    setOkMsg("");
    try {
      const res = await fetch(`${API_BASE}/userdetails/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${access}` },
      });
      if (res.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail || data?.error || "Delete failed");
      }
      // logout locally
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      navigate("/login", { replace: true });
    } catch (e) {
      setError(e.message || "Network error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-violet-100">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/30 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/60 px-3 py-2 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">← Back</span>
            </button>
            <h1 className="text-lg font-semibold text-slate-900">User Details</h1>
          </div>

          <div className="ml-auto">
            <button
              onClick={load}
              className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/60 px-3 py-2 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>
        )}
        {okMsg && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {okMsg}
          </div>
        )}

        {/* Profile Card */}
        <section className="rounded-3xl border border-white/40 bg-white/70 p-5 shadow-2xl shadow-indigo-200/30 backdrop-blur-xl">
          <h2 className="text-base font-semibold text-slate-900">Profile</h2>
          <div className="mt-3 grid gap-2 text-sm">
            <div>
              <span className="text-slate-500">Username:</span>{" "}
              <span className="font-medium">{loading ? "…" : user.username}</span>
            </div>
            <div>
              <span className="text-slate-500">Email:</span>{" "}
              <span className="font-medium">{loading ? "…" : user.email}</span>
            </div>
            <div>
              <span className="text-slate-500">Email verified:</span>{" "}
              {loading ? (
                "…"
              ) : user.email_verified ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-emerald-700">
                  ● verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-amber-700">
                  ○ not verified
                </span>
              )}
            </div>
          </div>

          {/* 2FA toggle */}
          <div className="mt-5 flex items-center justify-between border-t border-white/40 pt-4">
            <div>
              <div className="font-medium text-slate-900">Two-Factor Authentication</div>
              <div className="text-xs text-slate-500">Enable/disable from here (PUT {API_BASE}/userdetails/).</div>
            </div>
            <button
              onClick={() => toggle2FA(!user.two_factor_enabled)}
              disabled={saving2fa || loading}
              className={`group relative overflow-hidden rounded-xl px-4 py-2 text-sm shadow-sm transition-all duration-300 disabled:opacity-60 ${
                user.two_factor_enabled
                  ? "bg-emerald-600 text-white hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
                  : "border border-white/40 bg-white/70 text-slate-700 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">
                {saving2fa ? "Saving…" : user.two_factor_enabled ? "Disable 2FA" : "Enable 2FA"}
              </span>
            </button>
          </div>
        </section>

        {/* Change password */}
        <section className="rounded-3xl border border-white/40 bg-white/70 p-5 shadow-2xl shadow-indigo-200/30 backdrop-blur-xl">
          <h2 className="text-base font-semibold text-slate-900">Change Password</h2>
          <form onSubmit={changePassword} className="mt-4 grid max-w-md gap-3">
            <div className="relative">
              <label className="block text-sm text-slate-700">Current password</label>
              <input
                type="password"
                className="peer mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60"
                value={curPass}
                onChange={(e) => setCurPass(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <div className="relative">
              <label className="block text-sm text-slate-700">New password</label>
              <input
                type="password"
                className="peer mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="relative">
              <label className="block text-sm text-slate-700">Re-enter new password</label>
              <input
                type="password"
                className="peer mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-2.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60"
                value={againPass}
                onChange={(e) => setAgainPass(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={changingPass}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-60"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">{changingPass ? "Changing…" : "Change Password"}</span>
              </button>
            </div>
          </form>
        </section>

        {/* Danger zone */}
        <section className="rounded-3xl border border-rose-300/70 bg-rose-50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-rose-700">Danger Zone</h3>
              <p className="text-xs text-rose-600">This will permanently delete your account.</p>
            </div>
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={deleting}
              className="group relative overflow-hidden rounded-xl border border-rose-300 bg-white px-4 py-2 text-sm text-rose-700 shadow-sm transition-all duration-300 hover:bg-rose-100 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-rose-200/40 blur-md transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">{deleting ? "Deleting…" : "Delete Account"}</span>
            </button>
          </div>
        </section>
      </main>

      {/* Confirm Delete Modal (animated) */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-2xl border border-white/30 bg-white/80 p-5 shadow-2xl backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-slate-900">Permanently delete account?</h3>
            <p className="mt-1 text-sm text-slate-600">
              This action cannot be undone. Are you sure you want to proceed?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">No</span>
              </button>
              <button
                onClick={async () => {
                  setConfirmOpen(false);
                  await deleteAccount();
                }}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-4 py-2 text-sm font-medium text-white shadow-md animate-pulse hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/25 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Yes, delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
