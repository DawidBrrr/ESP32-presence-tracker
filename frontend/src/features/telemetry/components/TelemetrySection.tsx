"use client";

import { PulseIcon } from "../../../components/ui/Icons";
import type { Telemetry } from "../../../types/api";

type TelemetrySectionProps = {
  liveTelemetry: Telemetry[];
  wsStatus: string;
};

const statusMap: Record<string, { label: string; color: string }> = {
  connected: { label: "Połączono", color: "text-emerald-400" },
  connecting: { label: "Łączenie", color: "text-amber-300" },
  error: { label: "Błąd", color: "text-red-400" },
  disconnected: { label: "Rozłączono", color: "text-slate-400" }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleTimeString();
};

export function TelemetrySection({
  liveTelemetry,
  wsStatus
}: TelemetrySectionProps) {
  const status = statusMap[wsStatus] ?? statusMap.disconnected;

  return (
    <section className="panel h-fit rounded-3xl p-6 lg:sticky lg:top-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-emerald-200/70">
            <PulseIcon className="h-4 w-4 text-emerald-300" />
            Logi na żywo
          </div>
          <p className="mt-2 text-sm text-emerald-100/70">
            Historia aktualizacji z urządzeń.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-100">
          <span className={`status-dot ${status.color}`} />
          {status.label}
        </div>
      </div>

      <div className="mt-5 max-h-[360px] space-y-3 overflow-auto pr-1">
        {liveTelemetry.length === 0 ? (
          <div className="rounded-2xl border border-emerald-500/15 bg-[#08120f]/70 p-4 text-sm text-emerald-100/60">
            Czekam na aktualizacje z urządzeń.
          </div>
        ) : (
          liveTelemetry.map((item) => (
            <div
              key={`${item.id}-${item.timestamp}-live`}
              className="rounded-2xl border border-emerald-500/15 bg-[#08120f]/70 p-3"
            >
              <div className="flex items-center justify-between text-xs text-emerald-100/70">
                <span className="flex items-center gap-2">
                  <PulseIcon className="h-3.5 w-3.5 text-emerald-300" />
                  {item.id}
                </span>
                <span>{formatTimestamp(item.timestamp)}</span>
              </div>
              <div className="mt-2 text-2xl font-semibold text-emerald-200 glow-text">
                {item.count}
              </div>
              <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/60">
                osób
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
