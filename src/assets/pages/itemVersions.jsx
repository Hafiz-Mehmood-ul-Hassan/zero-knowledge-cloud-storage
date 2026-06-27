
// // src/assets/pages/itemVersions.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// import { API_BASE } from "../../config.js";

// export default function ItemVersions() {
//   const { itemId } = useParams();
//   const navigate = useNavigate();

//   const access = localStorage.getItem("access");
//   const [versions, setVersions] = useState([]);
//   const [role, setRole] = useState(null);             // "owner" | "editor" | "viewer"
//   const [scopeAll, setScopeAll] = useState(false);    // latest vs all
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // FEK modal (Download flow)
//   const [showFekModal, setShowFekModal] = useState(false);
//   const [fekInput, setFekInput] = useState("");
//   const [selectedVersionId, setSelectedVersionId] = useState(null);
//   const [fekBusy, setFekBusy] = useState(false);
//   const [fekErr, setFekErr] = useState("");

//   // Upload modal state
//   const [showUpload, setShowUpload] = useState(false);
//   const [uploadFile, setUploadFile] = useState(null);
//   const [uploadBusy, setUploadBusy] = useState(false);
//   const [uploadErr, setUploadErr] = useState("");
//   const [fekHex, setFekHex] = useState("");
//   const [fekB64, setFekB64] = useState("");
//   const [nonceB64, setNonceB64] = useState("");
//   const [fnameNonceB64, setFnameNonceB64] = useState("");
//   const [confirmSaved, setConfirmSaved] = useState(false);

//   // ---------- LOAD ----------
//   async function load(useAll = scopeAll) {
//     setLoading(true);
//     setError("");
//     try {
//       const url = `${API_BASE}/itemversions/${itemId}/` + (useAll ? `?scope=all` : ``);
//       const res = await fetch(url, {
//         headers: { Accept: "application/json", Authorization: `Bearer ${access}` },
//       });
//       if (res.status === 401) {
//         navigate("/login", { replace: true });
//         return;
//       }
//       const raw = await res.json().catch(() => []);
//       if (!res.ok) throw new Error(raw?.detail || "Failed to load versions");

//       // Parse role from response
//       let v = [], r = null;
//       if (Array.isArray(raw)) {
//         const last = raw[raw.length - 1];
//         if (typeof last === "string" && isRole(last)) {
//           r = last.toLowerCase(); v = raw.slice(0, -1);
//         } else if (last && typeof last === "object" && isRole(last.role)) {
//           r = (last.role || "").toLowerCase(); v = raw.slice(0, -1);
//         } else {
//           v = raw; r = null;
//         }
//       } else if (raw && typeof raw === "object") {
//         if (isRole(raw.role) && Array.isArray(raw.versions)) {
//           r = (raw.role || "").toLowerCase(); v = raw.versions;
//         } else {
//           v = []; r = null;
//         }
//       }

//       setRole(r);
//       setVersions(Array.isArray(v) ? v : []);
//       setScopeAll(!!useAll);
//     } catch (e) {
//       setError(e.message || "Network error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (!access) {
//       navigate("/login", { replace: true });
//       return;
//     }
//     load(false); // default to latest
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [itemId]);

//   const sorted = useMemo(
//     () => versions.slice().sort((a, b) => (b.version_no ?? 0) - (a.version_no ?? 0)),
//     [versions]
//   );

//   const canCreate = role === "owner" || role === "editor";

//   // ---------- DOWNLOAD (was View) ----------
//   function openDownload(vId) {
//     setSelectedVersionId(vId);
//     setFekInput("");
//     setFekErr("");
//     setShowFekModal(true);
//   }

//   async function proceedDownload() {
//     setFekErr("");
//     setFekBusy(true);
//     try {
//       const v = versions.find(x => String(x.id) === String(selectedVersionId));
//       if (!v) throw new Error("Version not found.");

//       // Verify hash of ciphertext
//       const ctBytes = b64ToBytes(v.file);
//       const expectedHex = (v.sha256_cipher || "").toLowerCase();
//       const actualHex = await sha256Hex(ctBytes);
//       if (actualHex !== expectedHex) throw new Error("Hash mismatch! Ciphertext may be tampered.");

//       // Import FEK
//       const keyBytes = parseKey(fekInput.trim());
//       const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, ["decrypt"]);

//       // Decrypt filename (optional)
//       let filename = `item-${itemId}-v${v.version_no}-plain.bin`;
//       const fnameCt = v.filename_ct || v.filename_ct_b64;
//       const fnameNonce = v.filename_nonce || v.filename_nonce_b64;
//       if (fnameCt && fnameNonce) {
//         try {
//           const fnBuf = await crypto.subtle.decrypt(
//             { name: "AES-GCM", iv: b64ToBytes(fnameNonce) },
//             cryptoKey,
//             b64ToBytes(fnameCt)
//           );
//           filename = new TextDecoder().decode(new Uint8Array(fnBuf)) || filename;
//         } catch {
//           /* ignore filename decrypt failure */
//         }
//       }

//       // Decrypt file
//       const nonce = b64ToBytes(v.cipher_nonce || v.nonce_b64);
//       const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv: nonce }, cryptoKey, ctBytes);
//       const blob = new Blob([new Uint8Array(plainBuf)], { type: "application/octet-stream" });
//       const url = URL.createObjectURL(blob);
//       triggerDownload(url, filename);
//       URL.revokeObjectURL(url);

//       setShowFekModal(false);
//     } catch (e) {
//       setFekErr(e.message || "Failed to decrypt");
//     } finally {
//       setFekBusy(false);
//     }
//   }

//   // ---------- UPLOAD ----------
//   function openUpload() {
//     const key = randomBytes(32);
//     const n = randomBytes(12);
//     const fn = randomBytes(12);
//     setFekHex(bytesToHex(key));
//     setFekB64(bytesToB64(key));
//     setNonceB64(bytesToB64(n));
//     setFnameNonceB64(bytesToB64(fn));
//     setUploadFile(null);
//     setConfirmSaved(false);
//     setUploadErr("");
//     setShowUpload(true);
//   }

//   async function handleUpload(e) {
//     e.preventDefault();
//     setUploadErr("");
//     if (!uploadFile) return setUploadErr("Please choose a file.");
//     if (!confirmSaved) return setUploadErr("Please confirm you have saved the FEK.");

//     setUploadBusy(true);
//     try {
//       const fileBytes = new Uint8Array(await uploadFile.arrayBuffer());
//       const keyBytes = hexToBytes(fekHex);
//       const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, ["encrypt"]);

//       const nonce = b64ToBytes(nonceB64);
//       const ctBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, cryptoKey, fileBytes);
//       const ctU8 = new Uint8Array(ctBuf);
//       const ciphertext_b64 = bytesToB64(ctU8);
//       const shaHex = await sha256Hex(ctU8);

//       const fnameNonce = b64ToBytes(fnameNonceB64);
//       const fnameBytes = new TextEncoder().encode(uploadFile.name);
//       const fnameCt = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: fnameNonce }, cryptoKey, fnameBytes));
//       const filename_ct_b64 = bytesToB64(fnameCt);

//       const payload = {
//         item_id: Number(itemId),
//         ciphertext_b64,
//         nonce_b64: nonceB64,
//         sha256_cipher: shaHex,
//         filename_ct_b64,
//         filename_nonce_b64: fnameNonceB64,
//       };

//       const res = await fetch(`${API_BASE}/itemversions/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json().catch(() => ({}));
//       if (res.status === 401) { navigate("/login", { replace: true }); return; }
//       if (!res.ok) throw new Error(data?.detail || data?.error || "Upload failed");

//       setShowUpload(false);
//       await load(scopeAll); // reload keeping current scope
//     } catch (err) {
//       setUploadErr(err.message || "Upload failed");
//     } finally {
//       setUploadBusy(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50">
//       {/* Header */}
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
//             <button onClick={() => navigate(-1)} className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50">
//               ← Back
//             </button>
//             <h1 className="font-semibold text-lg text-slate-900">Versions</h1>
//             {role && <span className="ml-1 rounded-full border px-2 py-0.5 text-xs text-slate-600">Role: {role}</span>}
//             {/* <span className="ml-1 rounded-full border px-2 py-0.5 text-xs text-slate-600">scope: {scopeAll ? "all" : "latest"}</span> */}
//           </div>

//           <div className="flex items-center gap-2">
//             {canCreate && (
//               <>
//                 <button
//                   onClick={() => load(true)}
//                   className={`rounded-xl border px-3 py-2 text-sm hover:bg-slate-50 ${scopeAll ? "border-indigo-400" : "border-slate-300"}`}
//                   title="Show all versions for this item"
//                 >
//                   All
//                 </button>
//                 <button
//                   onClick={() => load(false)}
//                   className={`rounded-xl border px-3 py-2 text-sm hover:bg-slate-50 ${!scopeAll ? "border-indigo-400" : "border-slate-300"}`}
//                   title="Show only latest scope"
//                 >
//                   Latest
//                 </button>
//                 <button
//                   onClick={openUpload}
//                   className="rounded-xl bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-500"
//                 >
//                   + New Version
//                 </button>
//               </>
//             )}
//             <button
//               onClick={() => load(scopeAll)}
//               className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
//             >
//               Refresh
//             </button>
//           </div>
        
//           {/* ...inside the header right-side actions block... */}
//             {role === "owner" && (
//               <>
//                 <button
//                   onClick={() => navigate(`/accessusers/${itemId}`)}
//                   className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
//                   title="Manage users who can access this item"
//                 >
//                   Access Users
//                 </button>
//                 <button
//                   onClick={() => navigate(`/itemactivity/${itemId}/`)}
//                   className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
//                   title="View item activity (coming soon)"
//                 >
//                   Activity
//                 </button>
//               </>
//             )}

//         </div>
      
//       </header>

//       {/* Body */}
//       <main className="mx-auto max-w-6xl px-4 py-6">
//         {error && (
//           <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
//             {error}
//           </div>
//         )}

//         <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
//           <div className="flex items-center justify-between">
//             <h2 className="font-semibold text-slate-900">Version History</h2>
//             <span className="text-sm text-slate-500">
//               {loading ? "Loading…" : `${sorted.length} entr${sorted.length === 1 ? "y" : "ies"}`}
//             </span>
//           </div>

//           <div className="mt-4 overflow-x-auto">
//             <table className="min-w-full text-sm">
//               <thead>
//                 <tr className="text-left text-slate-500">
//                   <th className="py-2 pr-4">Version #</th>
//                   <th className="py-2 pr-4">ID</th>
//                   <th className="py-2 pr-4">Cipher</th>
//                   <th className="py-2 pr-4">Created</th>
//                   <th className="py-2 pr-4">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr><td className="py-4" colSpan={5}>Fetching versions…</td></tr>
//                 ) : sorted.length === 0 ? (
//                   <tr><td className="py-4" colSpan={5}>No versions found.</td></tr>
//                 ) : (
//                   sorted.map(v => (
//                     <tr key={v.id} className="border-t border-slate-100 align-top">
//                       <td className="py-3 pr-4 font-medium text-slate-900">{v.version_no}</td>
//                       <td className="py-3 pr-4 font-mono text-xs text-slate-500">{v.id}</td>
//                       <td className="py-3 pr-4">{v.cipher}</td>
//                       <td className="py-3 pr-4">{new Date(v.created_at).toLocaleString()}</td>
//                       <td className="py-3 pr-4">
//                         <button
//                           onClick={() => openDownload(v.id)}
//                           className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
//                           title="Decrypt & download (enter FEK)"
//                         >
//                           Download
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </main>

//       {/* FEK modal (Download) */}
//       {showFekModal && (
//         <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
//           <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 p-5">
//             <h3 className="text-lg font-semibold text-slate-900">Enter FEK (File Encryption Key)</h3>
//             <p className="text-xs text-slate-600 mt-1">Paste 32-byte key in <b>hex</b> (64 chars) or <b>base64</b>.</p>
//             <input
//               autoFocus
//               value={fekInput}
//               onChange={e => setFekInput(e.target.value)}
//               placeholder="e.g. 64-hex or base64"
//               className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2"
//             />
//             {fekErr && <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-2 text-sm text-red-700">{fekErr}</div>}
//             <div className="mt-4 flex justify-end gap-2">
//               <button onClick={() => setShowFekModal(false)} className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50" disabled={fekBusy}>Cancel</button>
//               <button
//                 onClick={proceedDownload}
//                 className="rounded-lg bg-indigo-600 text-white px-3 py-1.5 hover:bg-indigo-500 disabled:opacity-60"
//                 disabled={!fekInput.trim() || !selectedVersionId || fekBusy}
//               >
//                 {fekBusy ? "Decrypting…" : "Download"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Upload modal */}
//       {showUpload && (
//         <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
//           <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200 p-5">
//             <h3 className="text-lg font-semibold text-slate-900">Upload New Version</h3>
//             <p className="text-xs text-slate-600 mt-1">File is encrypted on your device using AES-256-GCM.</p>

//             <form onSubmit={handleUpload} className="mt-4 grid gap-3">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700">Choose file</label>
//                 <input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} className="mt-2 w-full text-sm" required />
//               </div>

//               <div className="grid sm:grid-cols-2 gap-3 text-xs">
//                 <div className="rounded-xl border border-slate-200 p-3">
//                   <div className="font-medium text-slate-900">FEK (hex)</div>
//                   <div className="font-mono break-all">{fekHex}</div>
//                   <button type="button" onClick={() => navigator.clipboard?.writeText(fekHex)} className="mt-2 rounded-lg border border-slate-300 px-2 py-1 hover:bg-slate-50">Copy hex</button>
//                 </div>
//                 <div className="rounded-xl border border-slate-200 p-3">
//                   <div className="font-medium text-slate-900">FEK (base64)</div>
//                   <div className="font-mono break-all">{fekB64}</div>
//                   <button type="button" onClick={() => navigator.clipboard?.writeText(fekB64)} className="mt-2 rounded-lg border border-slate-300 px-2 py-1 hover:bg-slate-50">Copy base64</button>
//                 </div>
//               </div>

//               <div className="grid sm:grid-cols-2 gap-3 text-xs">
//                 <div className="rounded-xl border border-slate-200 p-3">
//                   <div className="font-medium text-slate-900">Nonce (file) b64</div>
//                   <div className="font-mono break-all">{nonceB64}</div>
//                 </div>
//                 <div className="rounded-xl border border-slate-200 p-3">
//                   <div className="font-medium text-slate-900">Nonce (filename) b64</div>
//                   <div className="font-mono break-all">{fnameNonceB64}</div>
//                 </div>
//               </div>

//               <label className="inline-flex items-center gap-2 text-sm">
//                 <input type="checkbox" checked={confirmSaved} onChange={(e) => setConfirmSaved(e.target.checked)} />
//                 I have saved the FEK securely.
//               </label>

//               {uploadErr && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{uploadErr}</div>}

//               <div className="mt-2 flex justify-end gap-2">
//                 <button type="button" onClick={() => setShowUpload(false)} className="rounded-lg border border-slate-300 px-3 py-1.5 hover:bg-slate-50" disabled={uploadBusy}>Cancel</button>
//                 <button type="submit" disabled={uploadBusy} className="rounded-lg bg-indigo-600 text-white px-3 py-1.5 hover:bg-indigo-500 disabled:opacity-60">
//                   {uploadBusy ? "Encrypting…" : "Encrypt & Upload"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ---------- helpers ---------- */
// function isRole(x) {
//   return typeof x === "string" && ["owner", "editor", "viewer"].includes(x.toLowerCase());
// }
// function randomBytes(n) {
//   const u8 = new Uint8Array(n);
//   crypto.getRandomValues(u8);
//   return u8;
// }
// function bytesToHex(u8) {
//   return Array.from(u8).map((b) => b.toString(16).padStart(2, "0")).join("");
// }
// function hexToBytes(h) {
//   const clean = h.trim();
//   if (!/^[0-9a-f]{64}$/i.test(clean)) throw new Error("Invalid FEK hex (must be 64 hex chars).");
//   const out = new Uint8Array(clean.length / 2);
//   for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.substr(i * 2, 2), 16);
//   return out;
// }
// function bytesToB64(u8) {
//   let bin = "";
//   for (let i = 0; i < u8.length; i++) bin += String.fromCharCode(u8[i]);
//   return btoa(bin);
// }
// function b64ToBytes(b64) {
//   const bin = atob(b64);
//   const out = new Uint8Array(bin.length);
//   for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
//   return out;
// }
// async function sha256Hex(u8) {
//   const d = await crypto.subtle.digest("SHA-256", u8);
//   return bytesToHex(new Uint8Array(d));
// }
// function parseKey(input) {
//   const s = input.trim();
//   const hexRe = /^[0-9a-f]{64}$/i;
//   if (hexRe.test(s)) return hexToBytes(s);
//   try { return b64ToBytes(s); } catch {}
//   throw new Error("Invalid FEK format. Use 64-char hex or base64.");
// }
// function triggerDownload(url, filename) {
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = filename || "file.bin";
//   document.body.appendChild(a);
//   a.click();
//   a.remove();
// }


// src/assets/pages/itemVersions.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../../config.js";

export default function ItemVersions() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const access = localStorage.getItem("access");
  const [versions, setVersions] = useState([]);
  const [role, setRole] = useState(null);             // "owner" | "editor" | "viewer"
  const [scopeAll, setScopeAll] = useState(false);    // latest vs all
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FEK modal (Download flow)
  const [showFekModal, setShowFekModal] = useState(false);
  const [fekInput, setFekInput] = useState("");
  const [selectedVersionId, setSelectedVersionId] = useState(null);
  const [fekBusy, setFekBusy] = useState(false);
  const [fekErr, setFekErr] = useState("");

  // Upload modal state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [fekHex, setFekHex] = useState("");
  const [fekB64, setFekB64] = useState("");
  const [nonceB64, setNonceB64] = useState("");
  const [fnameNonceB64, setFnameNonceB64] = useState("");
  const [confirmSaved, setConfirmSaved] = useState(false);

  // Share modal state
  const [showShare, setShowShare] = useState(false);
  const [shareRole, setShareRole] = useState("viewer"); // viewer | editor
  const [shareCopied, setShareCopied] = useState(false);

  // ---------- LOAD ----------
  async function load(useAll = scopeAll) {
    setLoading(true);
    setError("");
    try {
      const url = `${API_BASE}/itemversions/${itemId}/` + (useAll ? `?scope=all` : ``);
      const res = await fetch(url, {
        headers: { Accept: "application/json", Authorization: `Bearer ${access}` },
      });
      if (res.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      const raw = await res.json().catch(() => []);
      if (!res.ok) throw new Error(raw?.detail || "Failed to load versions");

      // Parse role from response
      let v = [], r = null;
      if (Array.isArray(raw)) {
        const last = raw[raw.length - 1];
        if (typeof last === "string" && isRole(last)) {
          r = last.toLowerCase(); v = raw.slice(0, -1);
        } else if (last && typeof last === "object" && isRole(last.role)) {
          r = (last.role || "").toLowerCase(); v = raw.slice(0, -1);
        } else {
          v = raw; r = null;
        }
      } else if (raw && typeof raw === "object") {
        if (isRole(raw.role) && Array.isArray(raw.versions)) {
          r = (raw.role || "").toLowerCase(); v = raw.versions;
        } else {
          v = []; r = null;
        }
      }

      setRole(r);
      setVersions(Array.isArray(v) ? v : []);
      setScopeAll(!!useAll);
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
    load(false); // default to latest
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  const sorted = useMemo(
    () => versions.slice().sort((a, b) => (b.version_no ?? 0) - (a.version_no ?? 0)),
    [versions]
  );

  const canCreate = role === "owner" || role === "editor";
  const canShare  = role === "owner" || role === "editor"; // sharing access allowed for owner/editor

  // ---------- DOWNLOAD ----------
  function openDownload(vId) {
    setSelectedVersionId(vId);
    setFekInput("");
    setFekErr("");
    setShowFekModal(true);
  }

  async function proceedDownload() {
    setFekErr("");
    setFekBusy(true);
    try {
      const v = versions.find(x => String(x.id) === String(selectedVersionId));
      if (!v) throw new Error("Version not found.");

      const ctBytes = b64ToBytes(v.file);
      const expectedHex = (v.sha256_cipher || "").toLowerCase();
      const actualHex = await sha256Hex(ctBytes);
      if (actualHex !== expectedHex) throw new Error("Hash mismatch! Ciphertext may be tampered.");

      const keyBytes = parseKey(fekInput.trim());
      const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, ["decrypt"]);

      // Decrypt filename (optional)
      let filename = `item-${itemId}-v${v.version_no}-plain.bin`;
      const fnameCt = v.filename_ct || v.filename_ct_b64;
      const fnameNonce = v.filename_nonce || v.filename_nonce_b64;
      if (fnameCt && fnameNonce) {
        try {
          const fnBuf = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: b64ToBytes(fnameNonce) },
            cryptoKey,
            b64ToBytes(fnameCt)
          );
          filename = new TextDecoder().decode(new Uint8Array(fnBuf)) || filename;
        } catch { /* ignore */ }
      }

      // Decrypt file
      const nonce = b64ToBytes(v.cipher_nonce || v.nonce_b64);
      const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv: nonce }, cryptoKey, ctBytes);
      const blob = new Blob([new Uint8Array(plainBuf)], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, filename);
      URL.revokeObjectURL(url);
      setShowFekModal(false);
    } catch (e) {
      setFekErr(e.message || "Failed to decrypt");
    } finally {
      setFekBusy(false);
    }
  }

  // ---------- UPLOAD ----------
  function openUpload() {
    const key = randomBytes(32);
    const n = randomBytes(12);
    const fn = randomBytes(12);
    setFekHex(bytesToHex(key));
    setFekB64(bytesToB64(key));
    setNonceB64(bytesToB64(n));
    setFnameNonceB64(bytesToB64(fn));
    setUploadFile(null);
    setConfirmSaved(false);
    setUploadErr("");
    setShowUpload(true);
  }

  async function handleUpload(e) {
    e.preventDefault();
    setUploadErr("");
    if (!uploadFile) return setUploadErr("Please choose a file.");
    if (!confirmSaved) return setUploadErr("Please confirm you have saved the FEK.");

    setUploadBusy(true);
    try {
      const fileBytes = new Uint8Array(await uploadFile.arrayBuffer());
      const keyBytes = hexToBytes(fekHex);
      const cryptoKey = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, ["encrypt"]);

      const nonce = b64ToBytes(nonceB64);
      const ctBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, cryptoKey, fileBytes);
      const ctU8 = new Uint8Array(ctBuf);
      const ciphertext_b64 = bytesToB64(ctU8);
      const shaHex = await sha256Hex(ctU8);

      const fnameNonce = b64ToBytes(fnameNonceB64);
      const fnameBytes = new TextEncoder().encode(uploadFile.name);
      const fnameCt = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: fnameNonce }, cryptoKey, fnameBytes));
      const filename_ct_b64 = bytesToB64(fnameCt);

      const payload = {
        item_id: Number(itemId),
        ciphertext_b64,
        nonce_b64: nonceB64,
        sha256_cipher: shaHex,
        filename_ct_b64,
        filename_nonce_b64: fnameNonceB64,
      };

      const res = await fetch(`${API_BASE}/itemversions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) { navigate("/login", { replace: true }); return; }
      if (!res.ok) throw new Error(data?.detail || data?.error || "Upload failed");

      setShowUpload(false);
      await load(scopeAll);
    } catch (err) {
      setUploadErr(err.message || "Upload failed");
    } finally {
      setUploadBusy(false);
    }
  }

  // ---------- SHARE (Access link) ----------
  function openShare() {
    setShareCopied(false);
    setShareRole("viewer");
    setShowShare(true);
  }
  function makeShareLink() {
    const base = window.location.origin;
    // Deep link to Access Users page with role hint
    const url = `${base}/itemversions/${itemId}?role=${encodeURIComponent(shareRole)}`;
    return url;
  }
  async function copyShare() {
    try {
      await navigator.clipboard.writeText(makeShareLink());
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1200);
    } catch {}
  }
  async function nativeShare() {
    const url = makeShareLink();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "VaultX — Share Access",
          text: `Grant ${shareRole.toUpperCase()} access for item #${itemId}`,
          url,
        });
      } catch { /* user cancelled */ }
    } else {
      await copyShare();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-violet-100">
      {/* Header */}
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

            <h1 className="text-lg font-semibold text-slate-900">Versions</h1>
            {role && (
              <span className="ml-1 rounded-full border border-white/40 bg-white/60 px-2 py-0.5 text-xs text-slate-700 shadow-sm">
                Role: {role}
              </span>
            )}
          </div>

          {/* CENTER cluster */}
          <div className="mx-auto flex items-center gap-2">
            {canCreate && (
              <>
                <button
                  onClick={() => load(true)}
                  className={`group relative overflow-hidden rounded-xl border px-3 py-2 text-sm shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${
                    scopeAll
                      ? "border-indigo-400 bg-white/80 text-slate-800"
                      : "border-white/40 bg-white/60 text-slate-700 hover:bg-white"
                  }`}
                  title="Show all versions for this item"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative">All</span>
                </button>
                <button
                  onClick={() => load(false)}
                  className={`group relative overflow-hidden rounded-xl border px-3 py-2 text-sm shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${
                    !scopeAll
                      ? "border-indigo-400 bg-white/80 text-slate-800"
                      : "border-white/40 bg-white/60 text-slate-700 hover:bg-white"
                  }`}
                  title="Show only latest scope"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative">Latest</span>
                </button>
                <button
                  onClick={openUpload}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-sm font-medium text-white shadow-md animate-pulse hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:animate-none"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative">+ New Version</span>
                </button>
              </>
            )}

            {/* Access/Activity/Share quick links (owner/editor) */}
            {(role === "owner" || role === "editor") && (
              <>
                <button
                  onClick={() => navigate(`/accessusers/${itemId}`)}
                  className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/60 px-3 py-2 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  title="Manage users who can access this item"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative">Access Users</span>
                </button>

                <button
                  onClick={() => navigate(`/itemactivity/${itemId}/`)}
                  className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/60 px-3 py-2 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  title="View item activity"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative">Activity</span>
                </button>

                {/* NEW: Share button */}
                <button
                  onClick={openShare}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                  title="Share access link"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative">Share</span>
                </button>
              </>
            )}
          </div>

          {/* RIGHT: Refresh at the very end */}
          <div className="ml-auto">
            <button
              onClick={() => load(scopeAll)}
              className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/60 px-3 py-2 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              title="Refresh list"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        {error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-4 shadow-2xl shadow-indigo-200/30 backdrop-blur-xl sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Version History</h2>
            <span className="text-sm text-slate-600">
              {loading ? "Loading…" : `${sorted.length} entr${sorted.length === 1 ? "y" : "ies"}`}
            </span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-3 pr-4">Version #</th>
                  <th className="py-3 pr-4">ID</th>
                  <th className="py-3 pr-4">Cipher</th>
                  <th className="py-3 pr-4">Created</th>
                  <th className="py-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="py-6 text-slate-500" colSpan={5}>Fetching versions…</td></tr>
                ) : sorted.length === 0 ? (
                  <tr><td className="py-6 text-slate-500" colSpan={5}>No versions found.</td></tr>
                ) : (
                  sorted.map(v => (
                    <tr key={v.id} className="border-t border-white/40 align-top">
                      <td className="py-3 pr-4 font-medium text-slate-900">{v.version_no}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-slate-500">{v.id}</td>
                      <td className="py-3 pr-4">{v.cipher}</td>
                      <td className="py-3 pr-4">{new Date(v.created_at).toLocaleString()}</td>
                      <td className="py-3 pr-4">
                        <button
                          onClick={() => openDownload(v.id)}
                          className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/70 px-3 py-1.5 text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                          title="Decrypt & download (enter FEK)"
                        >
                          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                          <span className="relative">Download</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* FEK modal (Download) */}
      {showFekModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-md rounded-2xl border border-white/30 bg-white/80 p-5 shadow-2xl backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-slate-900">Enter FEK (File Encryption Key)</h3>
            <p className="mt-1 text-xs text-slate-600">Paste 32-byte key in <b>hex</b> (64 chars) or <b>base64</b>.</p>

            <div className="relative mt-3">
              <input
                autoFocus
                value={fekInput}
                onChange={e => setFekInput(e.target.value)}
                placeholder="e.g. 64-hex or base64"
                className="w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-2.5 pl-12 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60"
              />
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <span className="grid h-6 w-6 place-items-center text-[18px] leading-none translate-y-[1px]">🔑</span>
              </span>
            </div>

            {fekErr && (
              <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 p-2 text-sm text-rose-700">
                {fekErr}
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowFekModal(false)}
                className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                disabled={fekBusy}
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Cancel</span>
              </button>
              <button
                onClick={proceedDownload}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-60"
                disabled={!fekInput.trim() || !selectedVersionId || fekBusy}
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">{fekBusy ? "Decrypting…" : "Download"}</span>
              </button>
            </div>

            <button
              onClick={() => setShowFekModal(false)}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-lg px-2 py-1 text-slate-500 transition hover:bg-white hover:text-slate-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/30 bg-white/80 p-5 shadow-2xl backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-slate-900">Upload New Version</h3>
            <p className="mt-1 text-xs text-slate-600">File is encrypted on your device using AES-256-GCM.</p>

            <form onSubmit={handleUpload} className="mt-4 grid gap-3">
              {/* File input — dropzone style */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Choose file</label>

                <input
                  id="filePick"
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="hidden"
                />

                <label
                  htmlFor="filePick"
                  className="mt-2 group flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/90 px-4 py-3 transition-all hover:border-indigo-400 hover:bg-white hover:shadow-md"
                  title="Click to choose a file"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md">📁</span>
                    <div className="leading-tight">
                      <div className="text-sm font-medium text-slate-900">
                        {uploadFile ? uploadFile.name : "Click to browse"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {uploadFile ? `${Math.round(uploadFile.size / 1024)} KB` : "or drag & drop here"}
                      </div>
                    </div>
                  </div>

                  <span className="pointer-events-none relative overflow-hidden rounded-lg border border-white/40 bg-white/70 px-3 py-1 text-xs text-slate-700 shadow-sm transition-all duration-300 group-hover:shadow">
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/25 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative">Choose file</span>
                  </span>
                </label>
              </div>

              {/* FEK boxes */}
              <div className="grid gap-3 text-xs sm:grid-cols-2">
                <div className="rounded-2xl border border-white/40 bg-white/70 p-3 shadow-sm">
                  <div className="font-medium text-slate-900">FEK (hex)</div>
                  <div className="font-mono break-all">{fekHex}</div>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(fekHex)}
                    className="group relative mt-2 overflow-hidden rounded-xl border border-white/40 bg-white/70 px-2 py-1 text-xs text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative">Copy hex</span>
                  </button>
                </div>
                <div className="rounded-2xl border border-white/40 bg-white/70 p-3 shadow-sm">
                  <div className="font-medium text-slate-900">FEK (base64)</div>
                  <div className="font-mono break-all">{fekB64}</div>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(fekB64)}
                    className="group relative mt-2 overflow-hidden rounded-xl border border-white/40 bg-white/70 px-2 py-1 text-xs text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative">Copy base64</span>
                  </button>
                </div>
              </div>

              {/* Nonces */}
              <div className="grid gap-3 text-xs sm:grid-cols-2">
                <div className="rounded-2xl border border-white/40 bg-white/70 p-3 shadow-sm">
                  <div className="font-medium text-slate-900">Nonce (file) b64</div>
                  <div className="font-mono break-all">{nonceB64}</div>
                </div>
                <div className="rounded-2xl border border-white/40 bg-white/70 p-3 shadow-sm">
                  <div className="font-medium text-slate-900">Nonce (filename) b64</div>
                  <div className="font-mono break-all">{fnameNonceB64}</div>
                </div>
              </div>

              {/* Confirm saved */}
              <label className="mt-1 inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={confirmSaved}
                  onChange={(e) => setConfirmSaved(e.target.checked)}
                />
                I have saved the FEK securely.
              </label>

              {uploadErr && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  {uploadErr}
                </div>
              )}

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  disabled={uploadBusy}
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative">Cancel</span>
                </button>

                <button
                  type="submit"
                  disabled={uploadBusy}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-md animate-pulse disabled:animate-none transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-60"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative">{uploadBusy ? "Encrypting…" : "Encrypt & Upload"}</span>
                </button>
              </div>
            </form>

            <button
              onClick={() => setShowUpload(false)}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-lg px-2 py-1 text-slate-500 transition hover:bg-white hover:text-slate-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Share modal */}
      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-md rounded-2xl border border-white/30 bg-white/80 p-5 shadow-2xl backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-slate-900">Share Access</h3>
            <p className="mt-1 text-xs text-slate-600">
              Choose a role and share the link to quickly navigate to the access page for this item.
            </p>

            <div className="mt-3 flex items-center gap-3 text-sm">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="sharerole"
                  value="viewer"
                  checked={shareRole === "viewer"}
                  onChange={() => setShareRole("viewer")}
                />
                Viewer
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="sharerole"
                  value="editor"
                  checked={shareRole === "editor"}
                  onChange={() => setShareRole("editor")}
                />
                Editor
              </label>
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-slate-700">Share link</label>
              <div className="relative mt-1">
                <input
                  readOnly
                  value={makeShareLink()}
                  className="w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-2.5 pr-28 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60"
                />
                <div className="absolute right-1 top-1 flex gap-1">
                  <button
                    type="button"
                    onClick={copyShare}
                    className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/70 px-3 py-1.5 text-xs text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative">{shareCopied ? "Copied!" : "Copy"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={nativeShare}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3 py-1.5 text-xs font-medium text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative">Share</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => navigate(`/accessusers/${itemId}?role=${shareRole}`)}
                className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Open Access Users</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowShare(false)}
                  className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/70 px-4 py-2 text-sm text-slate-700 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative">Close</span>
                </button>
                <button
                  onClick={nativeShare}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative">Share Now</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowShare(false)}
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

/* ---------- helpers ---------- */
function isRole(x) {
  return typeof x === "string" && ["owner", "editor", "viewer"].includes(x.toLowerCase());
}
function randomBytes(n) {
  const u8 = new Uint8Array(n);
  crypto.getRandomValues(u8);
  return u8;
}
function bytesToHex(u8) {
  return Array.from(u8).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function hexToBytes(h) {
  const clean = h.trim();
  if (!/^[0-9a-f]{64}$/i.test(clean)) throw new Error("Invalid FEK hex (must be 64 hex chars).");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.substr(i * 2, 2), 16);
  return out;
}
function bytesToB64(u8) {
  let bin = "";
  for (let i = 0; i < u8.length; i++) bin += String.fromCharCode(u8[i]);
  return btoa(bin);
}
function b64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
async function sha256Hex(u8) {
  const d = await crypto.subtle.digest("SHA-256", u8);
  return bytesToHex(new Uint8Array(d));
}
function parseKey(input) {
  const s = input.trim();
  const hexRe = /^[0-9a-f]{64}$/i;
  if (hexRe.test(s)) return hexToBytes(s);
  try { return b64ToBytes(s); } catch {}
  throw new Error("Invalid FEK format. Use 64-char hex or base64.");
}
function triggerDownload(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "file.bin";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
