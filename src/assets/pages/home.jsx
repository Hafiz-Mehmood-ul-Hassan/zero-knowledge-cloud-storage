// // src/assets/pages/home.jsx
// import { Link } from "react-router-dom";

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-800">
//       <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
//         <div className="mx-auto max-w-6xl h-16 px-4 flex items-center justify-between">
//           <Link to="/" className="flex items-center gap-2">
//             {/* <div className="h-8 w-8 rounded-xl bg-slate-900" /> */}
//             <div className=" mt-4 mx-auto mb-4 h-12 w-12 rounded-2xl bg-indigo-600 shadow-lg flex items-center justify-center text-white text-xl font-bold">
//             VX
//           </div>
//             <span className="font-semibold text-lg">VaultX</span>
//           </Link>

//           <nav className="hidden md:flex items-center gap-6 text-sm">
//             <a href="#services" className="hover:text-slate-900">Services</a>
//             <a href="#how" className="hover:text-slate-900">How it works</a>
//             <a href="#faq" className="hover:text-slate-900">FAQ</a>
//             <a href="#contact" className="hover:text-slate-900">Contact</a>
//           </nav>

//           <div className="flex items-center gap-2">
//             <Link to="/login" className="rounded-xl border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50">Login</Link>
//             <Link to="/signup" className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800">Sign Up</Link>
//           </div>
//         </div>
//       </header>

//       <main>
//         <section className="mx-auto max-w-6xl px-4 py-16">
//           <p className="inline-block rounded-full border border-slate-300 px-3 py-1 text-xs mb-4">Final Year Project • Secure File Vault</p>
//           <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
//             End-to-End Encrypted <span className="text-slate-600">File Storage</span>
//           </h1>
//           <p className="mt-4 text-slate-600 text-lg">
//             Upload files from the browser, encrypt on the client, store versions, and share with role-based access.
//           </p>
//           <div className="mt-6 flex gap-3">
//             <a href="#services" className="rounded-xl bg-slate-900 px-4 py-2 text-white text-sm hover:bg-slate-800">Explore Services</a>
//             <a href="#how" className="rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">How it works</a>
//           </div>
//         </section>

//         <section id="services" className="bg-white">
//           <div className="mx-auto max-w-6xl px-4 py-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {[
//               ["Client-Side Encryption", "AES-256-GCM in browser before upload", "🛡️"],
//               ["Versioning", "Every upload becomes an immutable version", "📦"],
//               ["Integrity", "SHA-256 of ciphertext to verify", "✅"],
//               ["Sharing", "Viewer / Editor roles per item", "👥"],
//               ["Auth", "JWT access + refresh flow", "🔑"],
//               ["Stack", "Django DRF + React", "⚙️"],
//             ].map(([t, d, i]) => (
//               <div key={t} className="rounded-2xl border border-slate-200 p-5 hover:shadow">
//                 <div className="text-3xl">{i}</div>
//                 <div className="mt-3 font-semibold text-slate-900">{t}</div>
//                 <p className="mt-1 text-sm text-slate-600">{d}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         <section id="how" className="bg-slate-50">
//           <div className="mx-auto max-w-6xl px-4 py-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//             {[
//               ["Encrypt on Frontend", "Browser generates nonce & encrypts with AES-GCM."],
//               ["Upload Ciphertext", "Send ct + nonce + sha256 to API."],
//               ["Version Stored", "Server validates & updates current revision."],
//               ["Share & Download", "Grant roles; decrypt client-side on download."],
//             ].map(([t, d], idx) => (
//               <div key={t} className="rounded-2xl border border-slate-200 bg-white p-5">
//                 <div className="text-xs text-slate-500">Step {idx + 1}</div>
//                 <div className="mt-1 font-semibold text-slate-900">{t}</div>
//                 <p className="mt-1 text-sm text-slate-600">{d}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         <section id="faq" className="bg-white">
//           <div className="mx-auto max-w-3xl px-4 py-12">
//             <h2 className="text-2xl font-bold text-slate-900 text-center">FAQ</h2>
//             <div className="mt-6 grid gap-3">
//               {[
//                 ["Is this page functional?", "This is a static front page; buttons only navigate to Login/Signup routes."],
//                 ["Where are files stored?", "Ciphertext on server; plaintext stays in browser."],
//                 ["Who can edit?", "Owner or editors; viewers are read-only."],
//               ].map(([q, a]) => (
//                 <details key={q} className="group rounded-xl border border-slate-200 bg-white p-4">
//                   <summary className="cursor-pointer list-none font-medium text-slate-900 flex items-center justify-between">
//                     {q}
//                     <span className="text-slate-500 group-open:rotate-180 transition">⌄</span>
//                   </summary>
//                   <p className="mt-2 text-slate-600 text-sm">{a}</p>
//                 </details>
//               ))}
//             </div>
//           </div>
//         </section>

//         <section id="contact" className="bg-slate-50">
//           <div className="mx-auto max-w-3xl px-4 py-12">
//             <h2 className="text-2xl font-bold text-slate-900 text-center">Contact</h2>
//             <form className="mt-6 grid gap-4">
//               <div className="grid sm:grid-cols-2 gap-4">
//                 <input className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Your name" />
//                 <input className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="Email" />
//               </div>
//               <textarea className="w-full rounded-xl border border-slate-300 px-3 py-2" rows={4} placeholder="Message" />
//               <button type="button" className="rounded-xl bg-slate-900 px-4 py-2 text-white text-sm w-fit hover:bg-slate-800">Send (static)</button>
//             </form>
//           </div>
//         </section>
//       </main>

//       <footer className="border-t border-slate-200 py-8">
//         <div className="mx-auto max-w-6xl px-4 flex items-center justify-between text-sm text-slate-600">
//           <div className="flex items-center gap-2">
//             <div className=" mt-4 mx-auto mb-4 h-12 w-12 rounded-2xl bg-indigo-600 shadow-lg flex items-center justify-center text-white text-xl font-bold">
//             VX
//           </div>
//             <span className="font-semibold">VaultX</span>
//           </div>
//           <span>© {new Date().getFullYear()} VaultX — Static demo</span>
//           <div className="hidden sm:flex gap-4">
//             <a href="#services">Services</a>
//             <a href="#how">How</a>
//             <a href="#contact">Contact</a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }


// src/assets/pages/home.jsx
import { Link } from "react-router-dom";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-violet-100 text-slate-800">
      {/* Header (glass) */}
      <header className="sticky top-0 z-20 border-b border-white/30 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-sm font-bold shadow-md shadow-indigo-300/40">
              VX
            </div>
            <span className="text-lg font-semibold">VaultX</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#services" className="hover:text-slate-900 transition-colors">Services</a>
            <a href="#how" className="hover:text-slate-900 transition-colors">How it works</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-slate-900 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/70 px-3 py-2 text-sm text-slate-700 shadow-sm transition-all hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Login</span>
            </Link>
            <Link
              to="/signup"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-sm font-medium text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Sign Up</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-[#A18CFF] to-[#6E63FF] opacity-25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-[#6E63FF] to-[#2713DB] opacity-25 blur-3xl" />

      <main>
        {/* HERO */}
        <section className="relative mx-auto max-w-6xl px-4 py-16">
          <style>{`
            @keyframes orbSpin { from {transform: rotate(0deg)} to {transform: rotate(360deg)} }
            @keyframes pulseSoft { 0%,100%{transform:scale(.98);opacity:.55} 50%{transform:scale(1.04);opacity:.9} }
          `}</style>

          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="mb-4 inline-block rounded-full border border-white/40 bg-white/70 px-3 py-1 text-xs shadow-sm">
                Final Year Project • Secure File Vault
              </p>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                End-to-End Encrypted{" "}
                <span className="bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent">
                  File Storage
                </span>
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Upload from your browser, encrypt on the client, store versions, and share with role-based access.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#services"
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative">Explore Services</span>
                </a>
                <a
                  href="#how"
                  className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/70 px-5 py-2.5 text-sm text-slate-700 shadow-sm transition-all hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-slate-300/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative">How it works</span>
                </a>
              </div>
            </div>

            {/* Right: animated orb card */}
            <div className="relative mx-auto w-full max-w-[520px]">
              <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-[#8B7BD1] via-[#4920E1] to-[#0C08A9] opacity-20 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/20 shadow-2xl backdrop-blur-2xl">
                <div className="relative flex h-[360px] items-center justify-center">
                  {/* inner gradient disk */}
                  <div className="absolute h-64 w-64 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 shadow-2xl" />
                  {/* rotating arc */}
                  <div
                    className="absolute h-72 w-72 rounded-full"
                    style={{
                      animation: "orbSpin 9s linear infinite",
                      background:
                        "conic-gradient(from 0deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,0) 320deg, rgba(255,255,255,0.9) 345deg, rgba(255,255,255,0.4) 360deg)",
                      WebkitMask:
                        "radial-gradient(circle, transparent 78%, black 79%, black 100%)",
                      mask:
                        "radial-gradient(circle, transparent 78%, black 79%, black 100%)",
                      filter: "blur(.6px)",
                      mixBlendMode: "screen",
                    }}
                  />
                  {/* blue glow */}
                  <div
                    className="absolute h-72 w-72 rounded-full"
                    style={{
                      animation: "pulseSoft 3s ease-in-out infinite",
                      background:
                        "radial-gradient(circle, rgba(59,130,246,.35), rgba(59,130,246,.12) 70%, transparent 80%)",
                    }}
                  />
                  {/* tiny orbiting dots */}
                  <div className="absolute -translate-x-[120px] -translate-y-[80px] h-2.5 w-2.5 rounded-full bg-white/80 shadow animate-pulse" />
                  <div className="absolute translate-x-[120px] -translate-y-[90px] h-2 w-2 rounded-full bg-white/70 shadow animate-pulse" />
                  {/* center cloud-ish puff */}
                  <div className="relative">
                    <div className="relative h-14 w-28 rounded-full bg-white shadow-md">
                      <div className="absolute -top-4 left-6 h-12 w-12 rounded-full bg-white shadow-md" />
                      <div className="absolute -top-3 right-6 h-10 w-10 rounded-full bg-white shadow-md" />
                      <div className="absolute -inset-3 rounded-full bg-white/30 blur-xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="bg-white/60 backdrop-blur-sm">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Client-Side Encryption", "AES-256-GCM in browser before upload", "🛡️"],
              ["Versioning", "Every upload becomes an immutable version", "📦"],
              ["Integrity", "SHA-256 of ciphertext to verify", "✅"],
              ["Sharing", "Viewer / Editor roles per item", "👥"],
              ["Auth", "JWT access + refresh flow", "🔑"],
              ["Stack", "Django DRF + React", "⚙️"],
            ].map(([t, d, i]) => (
              <div
                key={t}
                className="group relative overflow-hidden rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                <div className="text-3xl">{i}</div>
                <div className="mt-3 font-semibold text-slate-900">{t}</div>
                <p className="mt-1 text-sm text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="bg-gradient-to-b from-white/60 to-indigo-50/60">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Encrypt on Frontend", "Browser generates nonce & encrypts with AES-GCM."],
              ["Upload Ciphertext", "Send ct + nonce + sha256 to API."],
              ["Version Stored", "Server validates & updates current revision."],
              ["Share & Download", "Grant roles; decrypt client-side on download."],
            ].map(([t, d], idx) => (
              <div
                key={t}
                className="rounded-2xl border border-white/40 bg-white/70 p-5 shadow-sm"
              >
                <div className="text-xs text-slate-500">Step {idx + 1}</div>
                <div className="mt-1 font-semibold text-slate-900">{t}</div>
                <p className="mt-1 text-sm text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-white/60 backdrop-blur-sm">
          <div className="mx-auto max-w-3xl px-4 py-12">
            <h2 className="text-center text-2xl font-bold text-slate-900">FAQ</h2>
            <div className="mt-6 grid gap-3">
              {[
                ["Is this page functional?", "This is a static front page; buttons only navigate to Login/Signup routes."],
                ["Where are files stored?", "Ciphertext on server; plaintext stays in browser."],
                ["Who can edit?", "Owner or editors; viewers are read-only."],
              ].map(([q, a]) => (
                <details
                  key={q}
                  className="group rounded-2xl border border-white/40 bg-white/70 p-4 shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-slate-900">
                    {q}
                    <span className="transition group-open:rotate-180 text-slate-500">⌄</span>
                  </summary>
                  <p className="mt-2 text-sm text-slate-600">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="bg-gradient-to-b from-indigo-50/60 to-white/60">
          <div className="mx-auto max-w-3xl px-4 py-12">
            <h2 className="text-center text-2xl font-bold text-slate-900">Contact</h2>
            <form className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  className="w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60"
                  placeholder="Your name"
                />
                <input
                  className="w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60"
                  placeholder="Email"
                />
              </div>
              <textarea
                rows={4}
                className="w-full rounded-2xl border border-slate-300 bg-white/90 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60"
                placeholder="Message"
              />
              <button
                type="button"
                className="group relative w-fit overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Send (static)</span>
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/30 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-sm font-bold shadow">
              VX
            </div>
            <span className="font-semibold">VaultX</span>
          </div>
          <span>© {new Date().getFullYear()} VaultX — Static demo</span>
          <div className="hidden gap-4 sm:flex">
            <a href="#services" className="hover:text-slate-900">Services</a>
            <a href="#how" className="hover:text-slate-900">How</a>
            <a href="#contact" className="hover:text-slate-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
