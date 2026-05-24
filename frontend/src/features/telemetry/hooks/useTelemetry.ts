import { useCallback, useEffect, useState } from "react";
import { getLastTelemetry } from "../../../services/http/devices";
import { connectTelemetry } from "../../../services/ws/telemetry";
import type { Telemetry } from "../../../types/api";

type WsStatus = "disconnected" | "connecting" | "connected" | "error";

type ErrorHandler = (message: string) => void;

export function useTelemetry(token: string, onError?: ErrorHandler) {
  const [lastTelemetry, setLastTelemetry] = useState<Telemetry[]>([]);
  const [liveTelemetry, setLiveTelemetry] = useState<Telemetry[]>([]);
  const [wsStatus, setWsStatus] = useState<WsStatus>("disconnected");

  const refreshLastTelemetry = useCallback(async () => {
    if (!token) {
      setLastTelemetry([]);
      return;
    }

    try {
      const data = await getLastTelemetry(token);
      setLastTelemetry(data);
    } catch (error) {
      onError?.((error as Error).message);
    }
  }, [token, onError]);

  useEffect(() => {
    void refreshLastTelemetry();
  }, [refreshLastTelemetry]);

  useEffect(() => {
    if (!token) {
      setLiveTelemetry([]);
      setWsStatus("disconnected");
      return;
    }

    setWsStatus("connecting");
    const disconnect = connectTelemetry(
      token,
      (message) => {
        setLiveTelemetry((current) => [message, ...current].slice(0, 10));
        setWsStatus("connected");
      },
      (message) => {
        setWsStatus("error");
        onError?.(message);
      }
    );

    return () => {
      disconnect();
      setWsStatus("disconnected");
    };
  }, [token, onError]);

  return { lastTelemetry, liveTelemetry, wsStatus, refreshLastTelemetry };
}
