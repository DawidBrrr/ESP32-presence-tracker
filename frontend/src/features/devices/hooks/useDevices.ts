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

  const refresh = useCallback(async () => {
    if (!token) {
      setDevices([]);
      return;
    }

    const data = await getUserDevices(token);
    setDevices(data);
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

  return { devices, refresh, addUserDevice, removeUserDevice };
}
