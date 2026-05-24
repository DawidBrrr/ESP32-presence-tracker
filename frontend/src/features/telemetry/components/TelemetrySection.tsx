"use client";

import { useState } from "react";
import { buttonStyles } from "../../../components/ui/styles";
import type { Telemetry } from "../../../types/api";

type TelemetrySectionProps = {
  lastTelemetry: Telemetry[];
  liveTelemetry: Telemetry[];
  onRefresh: () => Promise<void>;
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleString();
};

export function TelemetrySection({
  lastTelemetry,
  liveTelemetry,
  onRefresh
}: TelemetrySectionProps) {
  const [busy, setBusy] = useState(false);

  const handleRefresh = async () => {
    setBusy(true);
    try {
      await onRefresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Last telemetry</h2>
          <button className={buttonStyles} disabled={busy} onClick={handleRefresh}>
            Refresh
          </button>
        </div>
        <div className="mt-4 grid gap-3 text-sm text-slate-300">
          {lastTelemetry.length === 0 ? (
            <span>No telemetry yet.</span>
          ) : (
            lastTelemetry.map((item) => (
              <div
                key={`${item.id}-${item.timestamp}`}
                className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2"
              >
                <div className="text-slate-200">{item.id}</div>
                <div className="text-xs text-slate-400">
                  Count: {item.count} | {formatTimestamp(item.timestamp)}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-lg font-semibold">Live telemetry (WS)</h2>
        <div className="mt-4 grid gap-3 text-sm text-slate-300">
          {liveTelemetry.length === 0 ? (
            <span>No live messages yet.</span>
          ) : (
            liveTelemetry.map((item) => (
              <div
                key={`${item.id}-${item.timestamp}-live`}
                className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2"
              >
                <div className="text-slate-200">{item.id}</div>
                <div className="text-xs text-slate-400">
                  Count: {item.count} | {formatTimestamp(item.timestamp)}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
