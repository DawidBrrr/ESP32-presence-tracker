import { useCallback, useEffect, useState } from "react";
import {
  addUserDevice as addUserDeviceRequest,
  deleteUserDevice as deleteUserDeviceRequest,
  getUserDevices
} from "../../../services/http/devices";
import type {
  Device,
  UserDeviceCreateRequest,
  UserDeviceCreateResponse
} from "../../../types/api";

export function useDevices(token: string) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!token) {
      setDevices([]);
      setError(null);
      return;
    }

    try {
      const data = await getUserDevices(token);
      setDevices(data);
      setError(null);
    } catch (err) {
      const error = err as any;
      // Handle authentication errors - don't retry with invalid token
      if (error.status === 401 || error.status === 403) {
        setDevices([]);
        setError("Authentication failed. Please log in again.");
      } else {
        setError(error.message);
      }
    }
  }, [token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addUserDevice = useCallback(
    async (payload: UserDeviceCreateRequest): Promise<UserDeviceCreateResponse> => {
      if (!token) {
        throw new Error("Login required.");
      }

      return addUserDeviceRequest(payload, token);
    },
    [token]
  );

  const removeUserDevice = useCallback(
    async (id: string): Promise<void> => {
      if (!token) {
        throw new Error("Login required.");
      }

      return deleteUserDeviceRequest(id, token);
    },
    [token]
  );

  return { devices, refresh, addUserDevice, removeUserDevice, error };
}
