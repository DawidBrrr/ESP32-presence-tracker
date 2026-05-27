import type {
  Device,
  DeviceRegistrationRequest,
  Telemetry,
  UserDeviceCreateRequest,
  UserDeviceCreateResponse
} from "../../types/api";
import { apiRequest } from "./client";

export function registerDevice(payload: DeviceRegistrationRequest) {
  return apiRequest<Device>("/api/devices/register", {
    method: "POST",
    body: payload
  });
}

export function addUserDevice(payload: UserDeviceCreateRequest, token: string) {
  return apiRequest<UserDeviceCreateResponse>("/api/user/devices", {
    method: "POST",
    body: payload,
    token
  });
}

export function getUserDevices(token: string) {
  return apiRequest<Device[]>("/api/user/devices", { token });
}

export function deleteUserDevice(id: string, token: string) {
  return apiRequest<void>(`/api/user/devices/${encodeURIComponent(id)}`, {
    method: "DELETE",
    token
  });
}

export function getLastTelemetry(token: string) {
  return apiRequest<Telemetry[]>("/api/user/devices/last", { token });
}
