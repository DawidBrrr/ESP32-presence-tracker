"use client";

import { buttonStyles } from "../../../components/ui/styles";

type DashboardHeaderProps = {
  wsStatus: string;
  username?: string;
  onLogout?: () => void;
};

const statusMap: Record<string, { label: string; color: string }> = {
  connected: { label: "Połączono", color: "text-emerald-400" },
  connecting: { label: "Łączenie", color: "text-amber-300" },
  error: { label: "Błąd", color: "text-red-400" },
  disconnected: { label: "Rozłączono", color: "text-slate-400" }
};

export function DashboardHeader({
  wsStatus,
  username,
  onLogout
}: DashboardHeaderProps) {
  const status = statusMap[wsStatus] ?? statusMap.disconnected;

  return (
    <header className="flex flex-col gap-6">
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-emerald-200/70">
        <span className={`status-dot ${status.color}`} />
        Panel obecności
      </div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-emerald-50">
            Presence Tracker
          </h1>
          <p className="mt-3 text-sm text-emerald-100/70">
            Monitoruj obecność w pomieszczeniach w czasie rzeczywistym
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="panel flex items-center gap-3 rounded-full px-4 py-2 text-xs text-emerald-100">
            <span className={`status-dot ${status.color}`} />
            <span className="uppercase tracking-[0.25em]">{status.label}</span>
          </div>
          {username ? (
            <div className="flex flex-col items-end gap-2 text-xs text-emerald-100/70">
              <span>Witaj, {username}</span>
              <button className={buttonStyles} onClick={onLogout}>
                Wyloguj
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
