export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-slate-300">
          Next.js + Tailwind starter
        </div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          ESP32 Presence Tracker
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          Replace this copy with your product message. This template ships with
          App Router, TypeScript, Tailwind, and a production-ready Dockerfile.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Real-time signals
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Connect sensor data streams and render presence in seconds.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Deploy anywhere
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Docker build outputs a small runtime image ready for production.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
