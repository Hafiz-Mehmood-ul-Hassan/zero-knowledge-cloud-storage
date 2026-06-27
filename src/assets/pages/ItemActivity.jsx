// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// import { API_BASE } from "../../config.js";
// // Change this to "/items" style if your API is different, e.g.
// // const ACTIVITY_URL = (itemId, params) => `${API_BASE}/items/${itemId}/activity/${params}`;
// const ACTIVITY_URL = (itemId, params) => `${API_BASE}/itemactivity/${itemId}/${params}`;

// export default function ItemActivity() {
//   const navigate = useNavigate();
//   const { itemId } = useParams();
//   const access = localStorage.getItem("access");

//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const [rows, setRows] = useState([]);

//   // simple filters
//   const [versionId, setVersionId] = useState("");  // optional
//   const [limit, setLimit] = useState(50);

//   async function load() {
//     setLoading(true);
//     setErr("");

//     try {
//       const params = buildQuery({ version_id: versionId || undefined, limit: limit || undefined });
//       const res = await fetch(ACTIVITY_URL(itemId, params), {
//         headers: { Accept: "application/json", Authorization: `Bearer ${access}` },
//       });
//       if (res.status === 401) { navigate("/login", { replace: true }); return; }
//       const data = await res.json().catch(() => []);
//       if (!res.ok) throw new Error(data?.detail || data?.error || "Failed to load activity");

//       // Expecting an array of activities
//       // Minimal shape we’ll support:
//       // { id, task, created_at, version (id or number), user (id or object), ... }
//       setRows(Array.isArray(data) ? data : []);
//     } catch (e) {
//       setErr(e.message || "Network error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (!access) { navigate("/login", { replace: true }); return; }
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [itemId]);

//   const sorted = useMemo(() => {
//     return rows.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//   }, [rows]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50">
//       {/* Header */}
//       <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
//         <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <a href="/dashboard"
//               className="h-9 w-9 rounded-xl bg-indigo-600 shadow-md flex items-center justify-center text-white text-sm font-bold"
//               aria-label="VaultX Home"
//             >
//               VX
//             </a>
//             <button onClick={() => navigate(-1)} className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50">
//               ← Back
//             </button>
//             <h1 className="font-semibold text-lg text-slate-900"> Activity</h1>
//             <span className="ml-2 text-xs text-slate-500">{loading ? "Loading…" : `${sorted.length} event${sorted.length === 1 ? "" : "s"}`}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <button onClick={load} className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">
//               Refresh
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Body */}
//       <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
//         {/* Filters */}
//         <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
//           <h2 className="font-semibold text-slate-900">Filters</h2>
//           <form
//             onSubmit={(e) => { e.preventDefault(); load(); }}
//             className="mt-3 grid gap-3 sm:grid-cols-[200px_140px_auto] sm:items-end"
//           >
//             <div>
//               <label className="block text-sm text-slate-600">Item ID (optional)</label>
//               <input
//                 value={versionId}
//                 onChange={(e) => setVersionId(e.target.value)}
//                 placeholder="e.g. 8"
//                 className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm text-slate-600">Limit</label>
//               <input
//                 type="number"
//                 min={1}
//                 max={500}
//                 value={limit}
//                 onChange={(e) => setLimit(Number(e.target.value) || 50)}
//                 className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
//               />
//             </div>
//             <div className="flex gap-2">
//               <button
//                 type="submit"
//                 className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-500"
//               >
//                 Apply
//               </button>
//               <button
//                 type="button"
//                 onClick={() => { setVersionId(""); setLimit(50); load(); }}
//                 className="rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
//               >
//                 Reset
//               </button>
//             </div>
//           </form>

//           {err && (
//             <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>
//           )}
//         </section>

//         {/* Table */}
//         <section className="rounded-2xl border border-slate-200 bg-white p-0 overflow-hidden shadow-sm">
//           <div className="px-4 sm:px-5 py-3 border-b border-slate-200 flex items-center justify-between">
//             <h2 className="font-semibold text-slate-900">Activity</h2>
//             <span className="text-sm text-slate-500">{loading ? "Loading…" : `${sorted.length} row${sorted.length === 1 ? "" : "s"}`}</span>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm">
//               <thead>
//                 <tr className="text-left text-slate-500">
//                   <th className="py-2 pl-4 pr-4 sm:pl-5">Time</th>
//                   <th className="py-2 pr-4">Task</th>
//                   <th className="py-2 pr-4">Item</th>
//                   <th className="py-2 pr-4">User</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <SkeletonRows />
//                 ) : sorted.length === 0 ? (
//                   <tr>
//                     <td colSpan={4} className="py-8 text-center text-slate-500">No activity yet.</td>
//                   </tr>
//                 ) : (
//                   sorted.map((r) => (
//                     <tr key={r.id ?? `${r.task}-${r.created_at}-${r.version ?? "x"}`} className="border-t border-slate-100">
//                       <td className="py-3 pl-4 pr-4 sm:pl-5 whitespace-nowrap">
//                         {formatDate(r.created_at)}
//                       </td>
//                       <td className="py-3 pr-4">
//                         <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-slate-700">
//                           {r.task || "—"}
//                         </span>
//                       </td>
//                       <td className="py-3 pr-4">
//                         {r.version?.id ?? r.version ?? "—"}
//                       </td>
//                       <td className="py-3 pr-4">
//                         {/* Support both id or object */}
//                         {r.user?.username ?? r.user?.email ?? r.user?.id ?? r.user ?? "—"}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         <p className="text-center text-xs text-slate-500">
//           Tip: Backend should not log sensitive keys/nonces. Store minimal info only.
//         </p>
//       </main>
//     </div>
//   );
// }

// /* helpers */
// function buildQuery(obj) {
//   const params = Object.entries(obj)
//     .filter(([, v]) => v !== undefined && v !== null && v !== "")
//     .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
//     .join("&");
//   return params ? `?${params}` : "";
// }
// function formatDate(s) {
//   try { return new Date(s).toLocaleString(); } catch { return s || "—"; }
// }
// function SkeletonRows({ rows = 6 }) {
//   return (
//     <>
//       {Array.from({ length: rows }).map((_, i) => (
//         <tr key={i} className="border-t border-slate-100 animate-pulse">
//           <td className="py-3 pl-4 pr-4 sm:pl-5">
//             <div className="h-3 w-40 rounded bg-slate-200" />
//           </td>
//           <td className="py-3 pr-4">
//             <div className="h-6 w-28 rounded-full bg-slate-200" />
//           </td>
//           <td className="py-3 pr-4">
//             <div className="h-3 w-16 rounded bg-slate-200" />
//           </td>
//           <td className="py-3 pr-4">
//             <div className="h-3 w-24 rounded bg-slate-200" />
//           </td>
//         </tr>
//       ))}
//     </>
//   );
// }

// src/assets/pages/ItemActivity.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../../config.js";

const ACTIVITY_URL = (itemId, params) => `${API_BASE}/itemactivity/${itemId}/${params}`;

export default function ItemActivity() {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const access = localStorage.getItem("access");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [rows, setRows] = useState([]);

  const [versionId, setVersionId] = useState("");
  const [limit, setLimit] = useState(50);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const params = buildQuery({ version_id: versionId || undefined, limit: limit || undefined });
      const res = await fetch(ACTIVITY_URL(itemId, params), {
        headers: { Accept: "application/json", Authorization: `Bearer ${access}` },
      });
      if (res.status === 401) { navigate("/login", { replace: true }); return; }
      const data = await res.json().catch(() => []);
      if (!res.ok) throw new Error(data?.detail || data?.error || "Failed to load activity");
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!access) { navigate("/login", { replace: true }); return; }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  const sorted = useMemo(() => rows.slice().sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)), [rows]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-violet-100">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/30 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
          <div className="flex items-center gap-3">
            <a href="/dashboard" className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-sm font-bold shadow-lg shadow-indigo-300/40">VX</a>
            <button onClick={()=>navigate(-1)} className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/60 px-3 py-2 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]">
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">← Back</span>
            </button>
            <h1 className="text-lg font-semibold text-slate-900">Activity</h1>
            <span className="ml-2 text-xs text-slate-600">{loading ? "Loading…" : `${sorted.length} event${sorted.length===1?"":"s"}`}</span>
          </div>

          <div className="ml-auto">
            <button onClick={load} className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/60 px-3 py-2 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]">
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {/* Filters */}
        <section className="rounded-3xl border border-white/40 bg-white/70 p-4 shadow-2xl shadow-indigo-200/30 backdrop-blur-xl sm:p-5">
          <h2 className="text-base font-semibold text-slate-900">Filters</h2>

          <form onSubmit={(e)=>{e.preventDefault(); load();}} className="mt-3 grid gap-3 sm:grid-cols-[240px_160px_auto] sm:items-end">
            <div className="relative">
              <label className="block text-sm text-slate-600">Version ID (optional)</label>
              <input value={versionId} onChange={(e)=>setVersionId(e.target.value)} placeholder="e.g. 8" className="peer mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-2.5 pl-12 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60" />
              <span className="pointer-events-none absolute bottom-[10px] left-3 grid h-6 w-6 place-items-center text-[18px] translate-y-[1px] leading-none">#</span>
            </div>

            <div className="relative">
              <label className="block text-sm text-slate-600">Limit</label>
              <input type="number" min={1} max={500} value={limit} onChange={(e)=>setLimit(Number(e.target.value)||50)} className="peer mt-1 w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-2.5 pl-12 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60" />
              <span className="pointer-events-none absolute bottom-[10px] left-3 grid h-6 w-6 place-items-center text-[18px] translate-y-[1px] leading-none">🔢</span>
            </div>

            <div className="flex gap-2">
              {/* APPLY — animated (pulse + shine) */}
              <button
                type="submit"
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-md animate-pulse transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              >
                {/* shine sweep */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/25 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                {/* soft outer ring on hover */}
                <span className="pointer-events-none absolute -inset-1 rounded-xl ring-0 ring-white/10 transition duration-300 group-hover:ring-8" />
                <span className="relative">Apply</span>
              </button>

              <button
                type="button"
                onClick={()=>{ setVersionId(""); setLimit(50); load(); }}
                className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/70 px-5 py-2.5 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Reset</span>
              </button>
            </div>
          </form>

          {err && <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{err}</div>}
        </section>

        {/* Table */}
        <section className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-0 shadow-2xl shadow-indigo-200/30 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/40 px-4 py-3 sm:px-5">
            <h2 className="text-base font-semibold text-slate-900">Activity</h2>
            <span className="text-sm text-slate-600">{loading ? "Loading…" : `${sorted.length} row${sorted.length===1?"":"s"}`}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-3 pl-4 pr-4 sm:pl-5">Time</th>
                  <th className="py-3 pr-4">Task</th>
                  <th className="py-3 pr-4">Version</th>
                  <th className="py-3 pr-4">User</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <SkeletonRows />
                ) : sorted.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-slate-500">No activity yet.</td></tr>
                ) : (
                  sorted.map((r)=>(
                    <tr key={r.id ?? `${r.task}-${r.created_at}-${r.version ?? "x"}`} className="border-t border-white/40 align-top">
                      <td className="whitespace-nowrap py-3 pl-4 pr-4 sm:pl-5">{formatDate(r.created_at)}</td>
                      <td className="py-3 pr-4">
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/50 bg-white/70 px-2 py-0.5 text-slate-700 shadow-sm">{r.task || "—"}</span>
                      </td>
                      <td className="py-3 pr-4">{r.version?.id ?? r.version ?? "—"}</td>
                      <td className="py-3 pr-4">{r.user?.username ?? r.user?.email ?? r.user?.id ?? r.user ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <p className="text-center text-xs text-slate-500">Tip: Backend should not log sensitive keys/nonces. Store minimal info only.</p>
      </main>
    </div>
  );
}

/* helpers */
function buildQuery(obj) {
  const params = Object.entries(obj)
    .filter(([,v])=>v!==undefined && v!==null && v!=="")
    .map(([k,v])=>`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return params ? `?${params}` : "";
}
function formatDate(s){ try{ return new Date(s).toLocaleString(); } catch { return s||"—"; } }
function SkeletonRows({ rows = 6 }) {
  return (
    <>
      {Array.from({length:rows}).map((_,i)=>(
        <tr key={i} className="border-t border-white/40 animate-pulse">
          <td className="py-3 pl-4 pr-4 sm:pl-5"><div className="h-3 w-40 rounded bg-slate-200" /></td>
          <td className="py-3 pr-4"><div className="h-6 w-28 rounded-full bg-slate-200" /></td>
          <td className="py-3 pr-4"><div className="h-3 w-16 rounded bg-slate-200" /></td>
          <td className="py-3 pr-4"><div className="h-3 w-24 rounded bg-slate-200" /></td>
        </tr>
      ))}
    </>
  );
}
