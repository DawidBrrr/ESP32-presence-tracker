"use client";

import { useCallback } from "react";
import { ClientOnly } from "../components/ClientOnly";
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

function HomeContent() {
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

  const { devices, refresh, addUserDevice, removeUserDevice } =
    useDevices(token);

  const { latestTelemetryById, liveTelemetry, wsStatus, refreshLastTelemetry } =
    useTelemetry(token, handleTelemetryError);

  const refreshAll = useCallback(async () => {
    await Promise.all([refresh(), refreshLastTelemetry()]);
  }, [refresh, refreshLastTelemetry]);

  const isAuthenticated = Boolean(token);

  return (
    <main className="app-shell">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <DashboardHeader
          wsStatus={wsStatus}
          username={auth?.username}
          onLogout={logout}
        />

        <NoticeBanner notice={notice} onDismiss={clearNotice} />

        {isAuthenticated ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-[2.2fr,1fr]">
            <div className="grid gap-6 animate-fade-up">
              <DeviceSection
                token={token}
                devices={devices}
                presenceById={latestTelemetryById}
                onAddUserDevice={addUserDevice}
                onDeleteDevice={removeUserDevice}
                onRefresh={refreshAll}
                onNotice={handleNotice}
              />
            </div>
            <div className="animate-fade-up delay-1">
              <TelemetrySection liveTelemetry={liveTelemetry} wsStatus={wsStatus} />
            </div>
          </div>
        ) : (
          <div className="mt-10 animate-fade-up">
            <AuthSection
              onRegister={register}
              onLogin={login}
              onNotice={handleNotice}
            />
          </div>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <ClientOnly
      fallback={
        <main className="app-shell">
          <div className="mx-auto max-w-6xl px-6 py-10" />
        </main>
      }
    >
      <HomeContent />
    </ClientOnly>
  );
}
