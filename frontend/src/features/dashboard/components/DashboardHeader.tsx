"use client";

import { buttonStyles } from "../../../components/ui/styles";

type DashboardHeaderProps = {
  apiBaseUrl: string;
  wsBaseUrl: string;
  wsStatus: string;
  username?: string;
  onLogout?: () => void;
};

export function DashboardHeader({
  apiBaseUrl,
  wsBaseUrl,
  wsStatus,
  username,
  onLogout
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-800 pb-6">
      <div className="inline-flex w-fit items-center rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-slate-300">
        Backend connected UI
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            ESP32 Presence Tracker
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            API: {apiBaseUrl} | WS: {wsBaseUrl} | Status: {wsStatus}
          </p>
        </div>
        {username ? (
          <div className="flex flex-col items-end gap-2 text-sm text-slate-300">
            <span>Signed in as {username}</span>
            <button className={buttonStyles} onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
