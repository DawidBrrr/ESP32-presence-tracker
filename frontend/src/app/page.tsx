"use client";

import { useCallback } from "react";
import { apiBaseUrl, wsBaseUrl } from "../config/env";
import { AuthSection } from "../features/auth/components/AuthSection";
import { useAuth } from "../features/auth/hooks/useAuth";
import { DashboardHeader } from "../features/dashboard/components/DashboardHeader";
import { NoticeBanner } from "../features/dashboard/components/NoticeBanner";
import { useNotice } from "../features/dashboard/hooks/useNotice";
import { DeviceSection } from "../features/devices/components/DeviceSection";
import { useDevices } from "../features/devices/hooks/useDevices";
import { TelemetrySection } from "../features/telemetry/components/TelemetrySection";
import { useTelemetry } from "../features/telemetry/hooks/useTelemetry";
import type { Notice } from "../types/ui";

export default function Home() {
  const { notice, showNotice, pushNotice, clearNotice } = useNotice();
  const { auth, token, register, login, logout } = useAuth();

  const handleNotice = useCallback(
    (nextNotice: Notice) => {
      pushNotice(nextNotice);
    },
    [pushNotice]
  );

  const handleTelemetryError = useCallback(
    (message: string) => {
      showNotice("error", message);
    },
    [showNotice]
  );

  const { devices, refresh, registerDevice, addUserDevice, removeUserDevice } =
    useDevices(token);

  const { lastTelemetry, liveTelemetry, wsStatus, refreshLastTelemetry } =
    useTelemetry(token, handleTelemetryError);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <DashboardHeader
          apiBaseUrl={apiBaseUrl}
          wsBaseUrl={wsBaseUrl}
          wsStatus={wsStatus}
          username={auth?.username}
          onLogout={logout}
        />

        <NoticeBanner notice={notice} onDismiss={clearNotice} />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <AuthSection
            onRegister={register}
            onLogin={login}
            onNotice={handleNotice}
          />
          <DeviceSection
            token={token}
            devices={devices}
            onRegisterDevice={registerDevice}
            onAddUserDevice={addUserDevice}
            onDeleteDevice={removeUserDevice}
            onRefresh={refresh}
            onNotice={handleNotice}
          />
        </div>

        <TelemetrySection
          lastTelemetry={lastTelemetry}
          liveTelemetry={liveTelemetry}
          onRefresh={refreshLastTelemetry}
        />
      </div>
    </main>
  );
}
