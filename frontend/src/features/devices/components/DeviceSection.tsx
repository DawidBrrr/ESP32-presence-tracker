"use client";

import { useState, type FormEvent } from "react";
import { buttonStyles, inputStyles } from "../../../components/ui/styles";
import type {
  Device,
  DeviceRegistrationRequest,
  UserDeviceCreateRequest,
  UserDeviceCreateResponse
} from "../../../types/api";
import type { Notice } from "../../../types/ui";

type DeviceSectionProps = {
  token: string;
  devices: Device[];
  onRegisterDevice: (payload: DeviceRegistrationRequest) => Promise<Device>;
  onAddUserDevice: (
    payload: UserDeviceCreateRequest
  ) => Promise<UserDeviceCreateResponse>;
  onDeleteDevice: (id: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  onNotice: (notice: Notice) => void;
};

export function DeviceSection({
  token,
  devices,
  onRegisterDevice,
  onAddUserDevice,
  onDeleteDevice,
  onRefresh,
  onNotice
}: DeviceSectionProps) {
  const [deviceRegForm, setDeviceRegForm] = useState({ id: "", token: "" });
  const [userDeviceForm, setUserDeviceForm] = useState({ id: "" });
  const [busy, setBusy] = useState(false);

  const handleRegisterDevice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);

    try {
      const device = await onRegisterDevice(deviceRegForm);
      onNotice({
        type: "success",
        message: `Device registered: ${device.name}`
      });
      setDeviceRegForm({ id: "", token: "" });
    } catch (error) {
      onNotice({ type: "error", message: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const handleAddUserDevice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      onNotice({ type: "error", message: "Login required." });
      return;
    }

    setBusy(true);

    try {
      await onAddUserDevice(userDeviceForm);
      setUserDeviceForm({ id: "" });
      await onRefresh();
      onNotice({ type: "success", message: "Device linked." });
    } catch (error) {
      onNotice({ type: "error", message: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteDevice = async (id: string) => {
    if (!token) {
      onNotice({ type: "error", message: "Login required." });
      return;
    }

    setBusy(true);

    try {
      await onDeleteDevice(id);
      await onRefresh();
      onNotice({ type: "success", message: "Device removed." });
    } catch (error) {
      onNotice({ type: "error", message: (error as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const handleRefresh = async () => {
    if (!token) {
      onNotice({ type: "error", message: "Login required." });
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
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-lg font-semibold">Devices</h2>
      <div className="mt-4 grid gap-6">
        <form className="grid gap-3" onSubmit={handleRegisterDevice}>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Register device (token based)
          </h3>
          <input
            className={inputStyles}
            placeholder="Device id"
            value={deviceRegForm.id}
            onChange={(event) =>
              setDeviceRegForm((current) => ({
                ...current,
                id: event.target.value
              }))
            }
          />
          <input
            className={inputStyles}
            placeholder="Registration token"
            value={deviceRegForm.token}
            onChange={(event) =>
              setDeviceRegForm((current) => ({
                ...current,
                token: event.target.value
              }))
            }
          />
          <button className={buttonStyles} disabled={busy}>
            Register device
          </button>
        </form>

        <form className="grid gap-3" onSubmit={handleAddUserDevice}>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Link device to user
          </h3>
          <input
            className={inputStyles}
            placeholder="Device id"
            value={userDeviceForm.id}
            onChange={(event) =>
              setUserDeviceForm({ id: event.target.value })
            }
          />
          <button className={buttonStyles} disabled={busy || !token}>
            Link device
          </button>
        </form>

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
              Your devices
            </h3>
            <button
              className={buttonStyles}
              disabled={busy || !token}
              onClick={handleRefresh}
            >
              Refresh
            </button>
          </div>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            {devices.length === 0 ? (
              <span>No devices linked.</span>
            ) : (
              devices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2"
                >
                  <span>{device.name}</span>
                  <button
                    className="text-xs text-red-300 hover:text-red-200"
                    onClick={() => handleDeleteDevice(device.id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
