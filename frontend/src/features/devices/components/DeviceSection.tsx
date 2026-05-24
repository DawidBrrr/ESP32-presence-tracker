"use client";

import { useState, type FormEvent } from "react";
import { HomeIcon } from "../../../components/ui/Icons";
import {
  buttonGhostStyles,
  buttonStyles,
  inputStyles
} from "../../../components/ui/styles";
import type {
  Device,
  Telemetry,
  UserDeviceCreateRequest,
  UserDeviceCreateResponse
} from "../../../types/api";
import type { Notice } from "../../../types/ui";

type DeviceSectionProps = {
  token: string;
  devices: Device[];
  presenceById: Record<string, Telemetry | undefined>;
  onAddUserDevice: (
    payload: UserDeviceCreateRequest
  ) => Promise<UserDeviceCreateResponse>;
  onDeleteDevice: (id: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  onNotice: (notice: Notice) => void;
};

const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) {
    return "Brak danych";
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toLocaleString();
};

export function DeviceSection({
  token,
  devices,
  presenceById,
  onAddUserDevice,
  onDeleteDevice,
  onRefresh,
  onNotice
}: DeviceSectionProps) {
  const [userDeviceForm, setUserDeviceForm] = useState({ id: "" });
  const [busy, setBusy] = useState(false);

  const handleAddUserDevice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      onNotice({ type: "error", message: "Zaloguj się, aby dodać urządzenie." });
      return;
    }

    setBusy(true);

    try {
      await onAddUserDevice(userDeviceForm);
      setUserDeviceForm({ id: "" });
      await onRefresh();
      onNotice({ type: "success", message: "Urządzenie zostało dodane." });
    } catch (error) {
      onNotice({ type: "error", message: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteDevice = async (id: string) => {
    if (!token) {
      onNotice({ type: "error", message: "Zaloguj się, aby usunąć urządzenie." });
      return;
    }

    setBusy(true);

    try {
      await onDeleteDevice(id);
      await onRefresh();
      onNotice({ type: "success", message: "Urządzenie zostało usunięte." });
    } catch (error) {
      onNotice({ type: "error", message: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const handleRefresh = async () => {
    if (!token) {
      onNotice({ type: "error", message: "Zaloguj się, aby odświeżyć dane." });
      return;
    }

    setBusy(true);

    try {
      await onRefresh();
    } catch (error) {
      onNotice({ type: "error", message: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel rounded-3xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-emerald-50">
            Twoje pomieszczenia
          </h2>
          <p className="mt-2 text-sm text-emerald-100/70">
            Dane aktualizowane w czasie rzeczywistym.
          </p>
        </div>
        <button
          className={buttonGhostStyles}
          disabled={busy || !token}
          onClick={handleRefresh}
        >
          Odśwież dane
        </button>
      </div>

      <form
        className="mt-6 grid gap-3 sm:grid-cols-[1fr,auto]"
        onSubmit={handleAddUserDevice}
      >
        <input
          className={inputStyles}
          placeholder="Identyfikator urządzenia"
          value={userDeviceForm.id}
          onChange={(event) =>
            setUserDeviceForm({ id: event.target.value })
          }
        />
        <button className={buttonStyles} disabled={busy || !token}>
          Dodaj urządzenie
        </button>
      </form>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {devices.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-emerald-500/15 bg-[#08120f]/70 p-6 text-sm text-emerald-100/70">
            Brak urządzeń. Dodaj pierwsze pomieszczenie, aby rozpocząć.
          </div>
        ) : (
          devices.map((device) => {
            const telemetry = presenceById[device.id];
            const countLabel = telemetry ? String(telemetry.count) : "--";
            const countText = telemetry ? "osób" : "brak danych";

            return (
              <div
                key={device.id}
                className="group relative overflow-hidden rounded-2xl border border-emerald-500/15 bg-[#08120f]/80 p-4 transition hover:border-emerald-400/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                      <HomeIcon className="h-6 w-6 text-emerald-300" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.25em] text-emerald-100/60">
                        Pokój
                      </div>
                      <div className="text-lg font-semibold text-emerald-50">
                        {device.name}
                      </div>
                    </div>
                  </div>
                  <button
                    className="text-xs text-red-200/80 transition hover:text-red-200"
                    onClick={() => handleDeleteDevice(device.id)}
                  >
                    Usuń
                  </button>
                </div>

                <div className="mt-4">
                  <div className="text-3xl font-semibold text-emerald-200 glow-text">
                    {countLabel}
                  </div>
                  <div className="text-xs uppercase tracking-[0.3em] text-emerald-100/60">
                    {countText}
                  </div>
                </div>

                <div className="mt-4 text-xs text-emerald-100/60">
                  Ostatnia aktualizacja: {formatTimestamp(telemetry?.timestamp)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
