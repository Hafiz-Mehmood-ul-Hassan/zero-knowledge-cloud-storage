// // src/assets/pages/AccessUsers.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { API_BASE } from "../../config.js";

// export default function AccessUsers() {
//   const { itemId } = useParams();
//   const navigate = useNavigate();
//   const access = localStorage.getItem("access");

//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // add form
//   const [username, setUsername] = useState("");
//   const [role, setRole] = useState("viewer"); // "viewer" | "editor"
//   const [adding, setAdding] = useState(false);

//   async function load() {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE}/itemaccess/${itemId}`, {
//         headers: { Accept: "application/json", Authorization: `Bearer ${access}` },
//       });
//       if (res.status === 401) { navigate("/login", { replace: true }); return; }
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.detail || "Failed to load access list");

//       // normalize to array
//       const arr = Array.isArray(data) ? data : (data ? [data] : []);
//       setRows(arr);
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
//   }, [itemId]);

//   const filtered = useMemo(() => rows.slice().sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at)), [rows]);

//   async function addAccess(e) {
//     e.preventDefault();
//     if (!username.trim()) return;
//     setAdding(true);
//     setError("");
//     const is_editor = role === "editor";
//     const is_viewer = role === "viewer";

//     try {
//       const res = await fetch(`${API_BASE}/itemaccess/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
//         body: JSON.stringify({
//           item: Number(itemId),
//           user: username.trim(),        // backend expects username string
//           is_editor,
//           is_viewer,
//         }),
//       });
//       const data = await res.json().catch(() => ({}));
//       if (res.status === 401) { navigate("/login", { replace: true }); return; }
//       if (!res.ok) throw new Error(data?.detail || data?.error || "Add failed");
//       setUsername("");
//       setRole("viewer");
//       await load();
//     } catch (e) {
//       setError(e.message || "Network error");
//     } finally {
//       setAdding(false);
//     }
//   }

//   async function updateRow(rowId, user, newRole) {
//     setError("");
//     const is_editor = newRole === "editor";
//     const is_viewer = newRole === "viewer";
//     try {
//       // PUT same endpoint as POST (as you said): identified by (item, user)
//       const res = await fetch(`${API_BASE}/itemaccess/`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
//         body: JSON.stringify({
//           item: Number(itemId),
//           user,           // username string
//           is_editor,
//           is_viewer,
//         }),
//       });
//       console.log(res.json());
      
//       const data = await res.json().catch(() => ({}));
//       if (res.status === 401) { navigate("/login", { replace: true }); return; }
//       if (!res.ok) throw new Error(data?.detail || data?.error || "Update failed");
//       await load();
//     } catch (e) {
//       setError(e.message || "Network error");
//     }
//   }

//   async function deleteRow(rowId) {
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE}/itemaccess/${itemId}/`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
//         body: JSON.stringify({ 
//             user: Number(rowId)
//         }),
//       });
//       if (res.status === 401) { navigate("/login", { replace: true }); return; }
//       if (!res.ok && res.status !== 204) {
//         const data = await res.json().catch(() => ({}));
//         throw new Error(data?.detail || data?.error || "Delete failed");
//       }
//       // refresh
//       // await load();
//       // clicking Refresh button;
//       load();

//      } catch (e) {
//       setError(e.message || "Network error");
//     }
//   }

//   function roleBadge(r) {
//     if (r?.is_editor) return <span className="inline-flex items-center gap-1 rounded-full border border-indigo-300 bg-indigo-50 px-2 py-0.5 text-indigo-700">Editor</span>;
//     if (r?.is_viewer) return <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-slate-700">Viewer</span>;
//     return <span className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-50 px-2 py-0.5 text-rose-700">Unknown</span>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50">
//       {/* Top bar */}
//       <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
//         <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <a href="/dashboard"
//               className="h-9 w-9 rounded-xl bg-indigo-600 shadow-md flex items-center justify-center text-white text-sm font-bold"
//               aria-label="VaultX Home"
//             >
//               VX
//             </a>
//             <button onClick={() => navigate(-1)} className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50">← Back</button>
//             <h1 className="font-semibold text-lg text-slate-900">Access Users</h1>
//           </div>
//           <div className="flex items-center gap-2">
//             <button onClick={load} className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">Refresh</button>
//           </div>
//         </div>
//       </header>

//       <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
//         {/* Add user form */}
//         <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
//           <h2 className="font-semibold text-slate-900">Add Access</h2>
//           <form onSubmit={addAccess} className="mt-3 grid gap-3 sm:flex sm:items-center">
//             <input
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="username (e.g. demouser2)"
//               className="w-full sm:w-72 rounded-xl border border-slate-300 px-3 py-2"
//               required
//             />
//             <div className="flex items-center gap-2">
//               <label className="inline-flex items-center gap-2 text-sm">
//                 <input
//                   type="radio"
//                   name="role"
//                   value="viewer"
//                   checked={role === "viewer"}
//                   onChange={() => setRole("viewer")}
//                 />
//                 Viewer
//               </label>
//               <label className="inline-flex items-center gap-2 text-sm">
//                 <input
//                   type="radio"
//                   name="role"
//                   value="editor"
//                   checked={role === "editor"}
//                   onChange={() => setRole("editor")}
//                 />
//                 Editor
//               </label>
//             </div>
//             <button
//               type="submit"
//               disabled={adding}
//               className="rounded-xl bg-indigo-600 px-4 py-2 text-white text-sm hover:bg-indigo-500 disabled:opacity-60"
//             >
//               {adding ? "Adding…" : "Add"}
//             </button>
//           </form>

//           {error && (
//             <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
//               {error}
//             </div>
//           )}
//         </section>

//         {/* Access list */}
//         <section className="rounded-2xl border border-slate-200 bg-white p-0 overflow-hidden shadow-sm">
//           <div className="px-4 sm:px-5 py-3 border-b border-slate-200 flex items-center justify-between">
//             <h2 className="font-semibold text-slate-900">Users with Access</h2>
//             <span className="text-sm text-slate-500">
//               {loading ? "Loading…" : `${filtered.length} entr${filtered.length === 1 ? "y" : "ies"}`}
//             </span>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm">
//               <thead>
//                 <tr className="text-left text-slate-500">
//                   <th className="py-2 pl-4 pr-4 sm:pl-5">ID</th>
//                   <th className="py-2 pr-4">User</th>
//                   <th className="py-2 pr-4">Role</th>
//                   <th className="py-2 pr-4">Expires</th>
//                   <th className="py-2 pr-4">Revoked</th>
//                   <th className="py-2 pr-4">Updated</th>
//                   <th className="py-2 pr-4">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr><td className="py-4" colSpan={7}>Fetching access list…</td></tr>
//                 ) : filtered.length === 0 ? (
//                   <tr><td className="py-4" colSpan={7}>No users have access yet.</td></tr>
//                 ) : (
//                   filtered.map((r) => (
//                     <tr key={r.id} className="border-t border-slate-100">
//                       <td className="py-3 pl-4 pr-4 sm:pl-5 font-mono text-xs text-slate-500">{r.id}</td>
//                       <td className="py-3 pr-4">{r.username}</td>
//                       <td className="py-3 pr-4">{roleBadge(r)}</td>
//                       <td className="py-3 pr-4">{r.expires_at ? new Date(r.expires_at).toLocaleString() : "—"}</td>
//                       <td className="py-3 pr-4">{r.revoked_at ? new Date(r.revoked_at).toLocaleString() : "—"}</td>
//                       <td className="py-3 pr-4">{new Date(r.updated_at).toLocaleString()}</td>
//                       <td className="py-3 pr-4">
//                         <div className="flex gap-2">
//                           {/* Update: quick toggle role */}
//                           <div className="inline-flex rounded-lg border border-slate-300 overflow-hidden">
//                             <button
//                               onClick={() => updateRow(r.id, r.user, "viewer")}
//                               className={`px-2 py-1 text-xs ${r.is_viewer ? "bg-slate-200" : "hover:bg-slate-50"}`}
//                               title="Make Viewer"
//                             >
//                               Viewer
//                             </button>
//                             <button
//                               onClick={() => updateRow(r.id, r.user, "editor")}
//                               className={`px-2 py-1 text-xs ${r.is_editor ? "bg-slate-200" : "hover:bg-slate-50"}`}
//                               title="Make Editor"
//                             >
//                               Editor
//                             </button>
//                           </div>
//                           {/* Delete */}
//                           <button
//                             onClick={() => deleteRow(r.user)}
//                             className="rounded-lg border border-rose-300 px-3 py-1.5 hover:bg-rose-50 text-rose-700"
//                             title="Delete access"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }


// src/assets/pages/AccessUsers.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../../config.js";

export default function AccessUsers() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const access = localStorage.getItem("access");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // add form
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("viewer"); // "viewer" | "editor"
  const [adding, setAdding] = useState(false);

  // delete confirm
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null); // username or id to send

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/itemaccess/${itemId}`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${access}` },
      });
      if (res.status === 401) { navigate("/login", { replace: true }); return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Failed to load access list");
      const arr = Array.isArray(data) ? data : (data ? [data] : []);
      setRows(arr);
    } catch (e) {
      setError(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!access) { navigate("/login", { replace: true }); return; }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  const filtered = useMemo(
    () => rows.slice().sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)),
    [rows]
  );

  async function addAccess(e) {
    e.preventDefault();
    if (!username.trim()) return;
    setAdding(true);
    setError("");
    const is_editor = role === "editor";
    const is_viewer = role === "viewer";

    try {
      const res = await fetch(`${API_BASE}/itemaccess/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
        body: JSON.stringify({
          item: Number(itemId),
          user: username.trim(), // backend expects username string
          is_editor,
          is_viewer,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) { navigate("/login", { replace: true }); return; }
      if (!res.ok) throw new Error(data?.detail || data?.error || "Add failed");
      setUsername("");
      setRole("viewer");
      await load();
    } catch (e) {
      setError(e.message || "Network error");
    } finally {
      setAdding(false);
    }
  }

  async function updateRow(rowId, user, newRole) {
    setError("");
    const is_editor = newRole === "editor";
    const is_viewer = newRole === "viewer";
    try {
      const res = await fetch(`${API_BASE}/itemaccess/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
        body: JSON.stringify({
          item: Number(itemId),
          user, // username string
          is_editor,
          is_viewer,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) { navigate("/login", { replace: true }); return; }
      if (!res.ok) throw new Error(data?.detail || data?.error || "Update failed");
      await load();
    } catch (e) {
      setError(e.message || "Network error");
    }
  }

  async function deleteRowApi(userOrId) {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/itemaccess/${itemId}/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
        body: JSON.stringify({ user: Number(userOrId) || userOrId }), // supports numeric id or username
      });
      if (res.status === 401) { navigate("/login", { replace: true }); return; }
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail || data?.error || "Delete failed");
      }
      await load();
    } catch (e) {
      setError(e.message || "Network error");
    }
  }

  function roleBadge(r) {
    if (r?.is_editor)
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-indigo-300 bg-indigo-50 px-2 py-0.5 text-indigo-700">
          Editor
        </span>
      );
    if (r?.is_viewer)
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-slate-700">
          Viewer
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-50 px-2 py-0.5 text-rose-700">
        Unknown
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-violet-100">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-white/30 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
          {/* LEFT cluster */}
          <div className="flex items-center gap-3">
            <a
              href="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-sm font-bold shadow-lg shadow-indigo-300/40"
              aria-label="VaultX Home"
            >
              VX
            </a>
            <button
              onClick={() => navigate(-1)}
              className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/60 px-3 py-2 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">← Back</span>
            </button>
            <h1 className="text-lg font-semibold text-slate-900">Access Users</h1>
          </div>

          {/* RIGHT: Refresh only */}
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

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {/* Add user form */}
        <section className="rounded-3xl border border-white/40 bg-white/70 p-4 shadow-2xl shadow-indigo-200/30 backdrop-blur-xl sm:p-5">
          <h2 className="text-base font-semibold text-slate-900">Add Access</h2>

          <form onSubmit={addAccess} className="mt-3 grid gap-3 sm:flex sm:items-center">
            {/* Username with left icon (centered) */}
            <div className="relative w-full sm:w-72">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username (e.g. demouser2)"
                className="peer w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-2.5 pl-12 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60"
                required
              />
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <span className="grid h-6 w-6 translate-y-[1px] place-items-center text-[18px] leading-none">👤</span>
              </span>
            </div>

            {/* Radios */}
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/70 px-3 py-2 text-sm shadow-sm">
                <input
                  type="radio"
                  name="role"
                  value="viewer"
                  checked={role === "viewer"}
                  onChange={() => setRole("viewer")}
                />
                Viewer
              </label>
              <label className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/70 px-3 py-2 text-sm shadow-sm">
                <input
                  type="radio"
                  name="role"
                  value="editor"
                  checked={role === "editor"}
                  onChange={() => setRole("editor")}
                />
                Editor
              </label>
            </div>

            {/* Add button (gradient + pulse) */}
            <button
              type="submit"
              disabled={adding}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-md animate-pulse disabled:animate-none transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-60"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">{adding ? "Adding…" : "Add"}</span>
            </button>
          </form>

          {error && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          )}
        </section>

        {/* Access list */}
        <section className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-0 shadow-2xl shadow-indigo-200/30 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/40 px-4 py-3 sm:px-5">
            <h2 className="text-base font-semibold text-slate-900">Users with Access</h2>
            <span className="text-sm text-slate-600">
              {loading ? "Loading…" : `${filtered.length} entr${filtered.length === 1 ? "y" : "ies"}`}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-3 pl-4 pr-4 sm:pl-5">ID</th>
                  <th className="py-3 pr-4">User</th>
                  <th className="py-3 pr-4">Role</th>
                  <th className="py-3 pr-4">Expires</th>
                  <th className="py-3 pr-4">Revoked</th>
                  <th className="py-3 pr-4">Updated</th>
                  <th className="py-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="py-6 text-slate-500" colSpan={7}>Fetching access list…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td className="py-6 text-slate-500" colSpan={7}>No users have access yet.</td></tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id} className="border-t border-white/40 align-top">
                      <td className="py-3 pl-4 pr-4 sm:pl-5 font-mono text-xs text-slate-500">{r.id}</td>
                      <td className="py-3 pr-4">{r.username}</td>
                      <td className="py-3 pr-4">{roleBadge(r)}</td>
                      <td className="py-3 pr-4">{r.expires_at ? new Date(r.expires_at).toLocaleString() : "—"}</td>
                      <td className="py-3 pr-4">{r.revoked_at ? new Date(r.revoked_at).toLocaleString() : "—"}</td>
                      <td className="py-3 pr-4">{new Date(r.updated_at).toLocaleString()}</td>
                      <td className="py-3 pr-4">
                        <div className="flex gap-2">
                          {/* Quick role toggle */}
                          <div className="inline-flex overflow-hidden rounded-xl border border-white/40 bg-white/70 shadow-sm">
                            <button
                              onClick={() => updateRow(r.id, r.user, "viewer")}
                              className={`px-2 py-1 text-xs transition hover:bg-white ${r.is_viewer ? "bg-slate-200" : ""}`}
                              title="Make Viewer"
                            >
                              Viewer
                            </button>
                            <button
                              onClick={() => updateRow(r.id, r.user, "editor")}
                              className={`px-2 py-1 text-xs transition hover:bg-white ${r.is_editor ? "bg-slate-200" : ""}`}
                              title="Make Editor"
                            >
                              Editor
                            </button>
                          </div>

                          {/* Delete with confirm modal */}
                          <button
                            onClick={() => { setPendingDelete(r.user); setConfirmOpen(true); }}
                            className="group relative overflow-hidden rounded-xl border border-rose-300 bg-rose-50 px-3 py-1.5 text-rose-700 transition hover:scale-[1.02] hover:bg-rose-100"
                            title="Delete access"
                          >
                            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-rose-200/40 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                            <span className="relative">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Confirm Delete Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-2xl border border-white/30 bg-white/80 p-5 shadow-2xl backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-slate-900">Are you sure?</h3>
            <p className="mt-1 text-sm text-slate-600">
              You’re about to remove access for <span className="font-medium">{String(pendingDelete)}</span>.
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
                onClick={async () => { await deleteRowApi(pendingDelete); setConfirmOpen(false); setPendingDelete(null); }}
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
