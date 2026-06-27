// // src/assets/pages/dashboard.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import { API_BASE } from "../../config.js";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const [items, setItems] = useState([]);
//   const [fetching, setFetching] = useState(true);
//   const [error, setError] = useState("");
//   const [creating, setCreating] = useState(false);
//   const [newName, setNewName] = useState("");
//   const [query, setQuery] = useState("");

//   const access = localStorage.getItem("access");

//   console.log(API_BASE);
  
  

//   async function loadItems() {
//     setFetching(true);
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE}/items/`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           Authorization: `Bearer ${access}`,
//         },
//       });
//       console.log(res);
      
//       if (res.status === 401) {
//         navigate("/login", { replace: true });
//         return;
//       }
//       const data = await res.json();
      
//       if (!res.ok) throw new Error(data?.detail || "Failed to load items");
//       setItems(Array.isArray(data) ? data : []);
//     } catch (e) {
//       setError(e.message || "Network error");
//     } finally {
//       setFetching(false);
//     }
//   }

//   async function createItem(e) {
//     e.preventDefault();
//     if (!newName.trim()) return;
//     setCreating(true);
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE}/items/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${access}`,
//         },
//         body: JSON.stringify({ name: newName.trim() }),
//       });
//       const data = await res.json().catch(() => ({}));
//       if (res.status === 401) {
//         navigate("/login", { replace: true });
//         return;
//       }
//       if (!res.ok) throw new Error(data?.detail || data?.error || "Create failed");
//       setNewName("");
//       await loadItems();
//     } catch (e) {
//       setError(e.message || "Network error");
//     } finally {
//       setCreating(false);
//     }
//   }

//   useEffect(() => {
//     if (!access) {
//       navigate("/login", { replace: true });
//       return;
//     }
//     loadItems();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   async function deleteItem(id) {
//   setError("");
//   try {
//     const res = await fetch(`${API_BASE}/items/${id}/`, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${access}`,
//       },
//     });

//     if (res.status === 401) {
//       navigate("/login", { replace: true });
//       return;
//     }

//     // Some backends return 204 No Content; treat any 2xx as success
//     if (!res.ok && res.status !== 204) {
//       const data = await res.json().catch(() => ({}));
//       throw new Error(data?.detail || data?.error || "Delete failed");
//     }

//     // refresh list (same as clicking Refresh)
//     await loadItems();
//   } catch (e) {
//     setError(e.message || "Network error");
//   }
// }


//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     const base = items.slice().sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
//     if (!q) return base;
//     return base.filter((it) => `${it.name}`.toLowerCase().includes(q) || String(it.id).includes(q));
//   }, [items, query]);

//   function logout() {
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");
//     navigate("/login", { replace: true });
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50">
//       {/* Top bar */}
//       <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
//         <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <a
//               href="/dashboard"
//               className="h-9 w-9 rounded-xl bg-indigo-600 shadow-md flex items-center justify-center text-white text-sm font-bold"
//               aria-label="VaultX Home"
//             >
//               VX
//             </a>
//             <h1 className="font-semibold text-lg text-slate-900">Dashboard</h1>
//             <span className="hidden sm:inline-block text-xs text-slate-500 ml-2">
//               {fetching ? "Loading…" : `${items.length} item${items.length === 1 ? "" : "s"}`}
//             </span>
//           </div>
//           <div className="flex items-center gap-2">
//             <button  onClick={() => navigate("/userdetails")}
//                 className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
//               >
//                 User Details
//               </button>
//             <button
//               onClick={loadItems}
//               className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
//             >
//               Refresh
//             </button>
//             <button
//               onClick={logout}
//               className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
//         {/* Create + Search toolbar */}
//         <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
//           <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             {/* Create */}
//             <form onSubmit={createItem} className="flex w-full sm:w-auto gap-2">
//               <input
//                 value={newName}
//                 onChange={(e) => setNewName(e.target.value)}
//                 placeholder='New item name e.g. "Demo File.txt"'
//                 className="flex-1 sm:w-80 rounded-xl border border-slate-300 px-3 py-2"
//               />
//               <button
//                 type="submit"
//                 disabled={creating}
//                 className="rounded-xl bg-indigo-600 px-4 py-2 text-white text-sm hover:bg-indigo-500 disabled:opacity-60"
//               >
//                 {creating ? "Creating…" : "Create Item"}
//               </button>
//             </form>

//             {/* Search */}
//             <div className="flex items-center gap-2">
//               <div className="relative">
//                 <input
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   placeholder="Search by name or ID…"
//                   className="w-full sm:w-64 rounded-xl border border-slate-300 pl-9 pr-3 py-2"
//                 />
//                 <span className="pointer-events-none mt-2 absolute inset-y-0 left-3 my-auto text-slate-400">
//                   🔎
//                 </span>
//               </div>
//               {query && (
//                 <button
//                   onClick={() => setQuery("")}
//                   className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
//                 >
//                   Clear
//                 </button>
//               )}
//             </div>
//           </div>

//           {error && (
//             <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
//               {error}
//             </div>
//           )}
//         </section>

//         {/* Items */}
//         <section className="rounded-2xl border border-slate-200 bg-white p-0 overflow-hidden shadow-sm">
//           {/* table header */}
//           <div className="px-4 sm:px-5 py-3 border-b border-slate-200 flex items-center justify-between">
//             <h2 className="font-semibold text-slate-900">Your Items</h2>
//             <span className="text-sm text-slate-500">
//               {fetching ? "Loading…" : `${filtered.length} match${filtered.length === 1 ? "" : "es"}`}
//             </span>
//           </div>

//           {/* table */}
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm">
//               <thead>
//                 <tr className="text-left text-slate-500">
//                   <th className="py-2 pl-4 pr-4 sm:pl-5">ID</th>
//                   <th className="py-2 pr-4">Name</th>
//                   <th className="py-2 pr-4">Version Limit</th>
//                   <th className="py-2 pr-4">Status</th>
//                   <th className="py-2 pr-4">Updated</th>
//                   <th className="py-2 pr-4">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {fetching ? (
//                   <SkeletonRows />
//                 ) : filtered.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} className="py-8 text-center text-slate-500">
//                       {items.length === 0 && !query
//                         ? "No items yet. Create your first one above."
//                         : "No results. Try a different search."}
//                     </td>
//                   </tr>
//                 ) : (
//                   filtered.map((it) => (
//                     <tr key={it.id} className="border-t border-slate-100">
//                       <td className="py-3 pl-4 pr-4 sm:pl-5 font-mono text-xs text-slate-500">{it.id}</td>
//                       <td className="py-3 pr-4 font-medium text-slate-900">{it.name}</td>
//                       <td className="py-3 pr-4">{it.version_limit}</td>
//                       <td className="py-3 pr-4">
//                         {it.current_revision ? (
//                           <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-emerald-700">
//                             ● has version
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-slate-600">
//                             ○ empty
//                           </span>
//                         )}
//                       </td>
//                       <td className="py-3 pr-4">{new Date(it.updated_at).toLocaleString()}</td>
//                       <td className="py-3 pr-4">
//                         <button
//                           onClick={() => navigate(`/itemversions/${it.id}`)}
//                           className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
//                         >
//                           Open
//                         </button>
//                         <button onClick={() => deleteItem(it.id)}
//                             className="ml-2 rounded-lg border border-rose-300 px-3 py-1.5 hover:bg-rose-50 text-rose-700"
//                             title="Delete item"
//                           >
//                             Delete
//                           </button>

//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         {/* Small foot note */}
//         <p className="text-xs text-slate-500 text-center">
//           Tip: “Open” goes to your versions page route <code className="font-mono">/itemversions/:id</code>.
//           Change it if your route is different.
//         </p>
//       </main>
//     </div>
//   );
// }

// /* --------- tiny components --------- */

// function SkeletonRows({ rows = 5 }) {
//   return (
//     <>
//       {Array.from({ length: rows }).map((_, i) => (
//         <tr key={i} className="border-t border-slate-100 animate-pulse">
//           <td className="py-3 pl-4 pr-4 sm:pl-5">
//             <div className="h-3 w-12 rounded bg-slate-200" />
//           </td>
//           <td className="py-3 pr-4">
//             <div className="h-3 w-40 rounded bg-slate-200" />
//           </td>
//           <td className="py-3 pr-4">
//             <div className="h-3 w-16 rounded bg-slate-200" />
//           </td>
//           <td className="py-3 pr-4">
//             <div className="h-6 w-24 rounded-full bg-slate-200" />
//           </td>
//           <td className="py-3 pr-4">
//             <div className="h-3 w-40 rounded bg-slate-200" />
//           </td>
//           <td className="py-3 pr-4">
//             <div className="h-8 w-20 rounded bg-slate-200" />
//           </td>
//         </tr>
//       ))}
//     </>
//   );
// }


// src/assets/pages/dashboard.jsx


// src/assets/pages/dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../config.js";

export default function Dashboard() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [query, setQuery] = useState("");

  // ► confirm delete modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const access = localStorage.getItem("access");

  async function loadItems() {
    setFetching(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/items/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      if (res.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Failed to load items");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Network error");
    } finally {
      setFetching(false);
    }
  }

  async function createItem(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/items/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      if (!res.ok) throw new Error(data?.detail || data?.error || "Create failed");
      setNewName("");
      await loadItems();
    } catch (e) {
      setError(e.message || "Network error");
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    if (!access) {
      navigate("/login", { replace: true });
      return;
    }
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // original delete (logic same) — called only after user confirms
  async function deleteItem(id) {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/items/${id}/`, {
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
      await loadItems();
    } catch (e) {
      setError(e.message || "Network error");
    }
  }

  // ► modal helpers
  function askDelete(id) {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  }
  async function confirmDelete() {
    const id = pendingDeleteId;
    setConfirmOpen(false);
    setPendingDeleteId(null);
    if (id != null) await deleteItem(id);
  }
  function cancelDelete() {
    setConfirmOpen(false);
    setPendingDeleteId(null);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = items
      .slice()
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    if (!q) return base;
    return base.filter(
      (it) =>
        `${it.name}`.toLowerCase().includes(q) || String(it.id).includes(q)
    );
  }, [items, query]);

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-violet-100">
      {/* Top bar (glass) */}
      <header className="sticky top-0 z-10 border-b border-white/30 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <a
              href="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-sm font-bold shadow-lg shadow-indigo-300/40"
              aria-label="VaultX Home"
            >
              VX
            </a>
            <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
            <span className="ml-2 hidden text-xs text-slate-600 sm:inline-block">
              {fetching ? "Loading…" : `${items.length} item${items.length === 1 ? "" : "s"}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* User Details */}
            <button
              onClick={() => navigate("/userdetails")}
              className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/60 px-3 py-2 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">User Details</span>
            </button>

            {/* Refresh */}
            <button
              onClick={loadItems}
              className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/60 px-3 py-2 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Refresh</span>
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="group relative overflow-hidden rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-slate-800 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/10 blur-md transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {/* Create + Search toolbar (glass card) */}
        <section className="rounded-3xl border border-white/40 bg-white/70 p-4 shadow-2xl shadow-indigo-200/30 backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Create */}
            <form onSubmit={createItem} className="flex w-full gap-2 sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder='New item name e.g. "Demo File.txt"'
                  className="w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-2.5 pl-12 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60"
                />
                {/* centered emoji */}
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <span className="grid h-6 w-6 place-items-center text-[18px] leading-none translate-y-[1px]">
                    ➕
                  </span>
                </span>
              </div>

              {/* Create Item button with pulse + shine */}
              <button
                type="submit"
                disabled={creating}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-white shadow-md animate-pulse disabled:animate-none transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative flex items-center justify-center gap-2 text-sm">
                  {creating ? "Creating…" : "Create Item"}
                </span>
              </button>
            </form>

            {/* Search */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name or ID…"
                  className="w-full rounded-2xl border border-slate-300 bg-white/90 py-2.5 pl-12 pr-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60 sm:w-64"
                />
                {/* centered emoji */}
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <span className="grid h-6 w-6 place-items-center text-[18px] leading-none translate-y-[1px]">
                    🔎
                  </span>
                </span>
              </div>
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/70 px-3 py-2 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative">Clear</span>
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          )}
        </section>

        {/* Items table (glass card) */}
        <section className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-2xl shadow-indigo-200/30 backdrop-blur-xl">
          {/* header */}
          <div className="flex items-center justify-between border-b border-white/40 px-4 py-3 sm:px-5">
            <h2 className="text-base font-semibold text-slate-900">Your Items</h2>
            <span className="text-sm text-slate-600">
              {fetching
                ? "Loading…"
                : `${filtered.length} match${filtered.length === 1 ? "" : "es"}`}
            </span>
          </div>

          {/* table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-3 pl-4 pr-4 sm:pl-5">ID</th>
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Version Limit</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Updated</th>
                  <th className="py-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fetching ? (
                  <SkeletonRows />
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500">
                      {items.length === 0 && !query
                        ? "No items yet. Create your first one above."
                        : "No results. Try a different search."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((it) => (
                    <tr key={it.id} className="border-t border-white/40">
                      <td className="py-3 pl-4 pr-4 font-mono text-xs text-slate-500 sm:pl-5">
                        {it.id}
                      </td>
                      <td className="py-3 pr-4 font-medium text-slate-900">{it.name}</td>
                      <td className="py-3 pr-4">{it.version_limit}</td>
                      <td className="py-3 pr-4">
                        {it.current_revision ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-emerald-700">
                            ● has version
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-slate-600">
                            ○ empty
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-4">{new Date(it.updated_at).toLocaleString()}</td>
                      <td className="py-3 pr-4">
                        {/* Open */}
                        <button
                          onClick={() => navigate(`/itemversions/${it.id}`)}
                          className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/70 px-3 py-1.5 text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                          <span className="relative">Open</span>
                        </button>

                        {/* Delete — opens modal */}
                        <button
                          onClick={() => askDelete(it.id)}
                          title="Delete item"
                          className="group relative ml-2 overflow-hidden rounded-xl border border-rose-300 bg-rose-50 px-3 py-1.5 text-rose-700 transition-all duration-300 hover:border-rose-600 hover:bg-rose-600 hover:text-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                          <span className="relative">Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Small foot note */}
        <p className="text-center text-xs text-slate-500">
          Tip: “Open” goes to your versions page route{" "}
          <code className="font-mono">/itemversions/:id</code>. Change it if your route is different.
        </p>
      </main>

      {/* ► Confirm Delete Modal */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-[92%] max-w-sm rounded-2xl border border-white/30 bg-white/80 p-5 shadow-2xl backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-slate-900">Are you sure?</h3>
            <p className="mt-1 text-sm text-slate-600">
              This action will permanently delete the item.
            </p>

            <div className="mt-4 flex items-center justify-end gap-2">
              {/* No (simple white) */}
              <button
                onClick={cancelDelete}
                className="rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-white"
              >
                No
              </button>

              {/* Yes (red + animation) */}
              <button
                onClick={confirmDelete}
                className="group relative overflow-hidden rounded-xl border border-rose-500 bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-rose-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                autoFocus
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Yes</span>
              </button>
            </div>

            {/* close (X) optional */}
            <button
              onClick={cancelDelete}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-lg px-2 py-1 text-slate-500 transition hover:bg-white hover:text-slate-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* --------- tiny components --------- */
function SkeletonRows({ rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse border-t border-white/40">
          <td className="py-3 pl-4 pr-4 sm:pl-5">
            <div className="h-3 w-12 rounded bg-slate-200" />
          </td>
          <td className="py-3 pr-4">
            <div className="h-3 w-40 rounded bg-slate-200" />
          </td>
          <td className="py-3 pr-4">
            <div className="h-3 w-16 rounded bg-slate-200" />
          </td>
          <td className="py-3 pr-4">
            <div className="h-6 w-24 rounded-full bg-slate-200" />
          </td>
          <td className="py-3 pr-4">
            <div className="h-3 w-40 rounded bg-slate-200" />
          </td>
          <td className="py-3 pr-4">
            <div className="h-8 w-20 rounded bg-slate-200" />
          </td>
        </tr>
      ))}
    </>
  );
}
