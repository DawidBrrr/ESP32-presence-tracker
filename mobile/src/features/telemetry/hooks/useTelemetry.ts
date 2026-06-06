import { useCallback, useEffect, useState } from "react";
import { getLastTelemetry } from "../../../services/http/devices";
import { connectTelemetry } from "../../../services/ws/telemetry";
import type { Telemetry } from "../../../types/api";

type WsStatus = "disconnected" | "connecting" | "connected" | "error";

type ErrorHandler = (message: string) => void;

export function useTelemetry(token: string, onError?: ErrorHandler) {
  const [latestTelemetryById, setLatestTelemetryById] = useState<
    Record<string, Telemetry>
  >({});
  const [liveTelemetry, setLiveTelemetry] = useState<Telemetry[]>([]);
  const [wsStatus, setWsStatus] = useState<WsStatus>("disconnected");

  const refreshLastTelemetry = useCallback(async () => {
    if (!token) {
      setLatestTelemetryById({});
      return;
    }

    try {
      const data = await getLastTelemetry(token);
      const nextMap: Record<string, Telemetry> = {};

      data.forEach((item) => {
        nextMap[item.id] = item;
      });

      setLatestTelemetryById(nextMap);
    } catch (error) {
      const message = (error as Error).message;
      onError?.(message);
      throw error;
    }
  }, [token, onError]);

  useEffect(() => {
    void refreshLastTelemetry().catch(() => undefined);
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
        setLatestTelemetryById((current) => ({
          ...current,
          [message.id]: message
        }));
        setLiveTelemetry((current) => [message, ...current].slice(0, 5));
        setWsStatus("connected");
      },
      (message) => {
        setWsStatus("error");
        onError?.(message);
      },
      () => {
        setWsStatus("connected");
      },
      () => {
        setWsStatus("disconnected");
      }
    );

    return () => {
      disconnect();
      setWsStatus("disconnected");
    };
  }, [token, onError]);

  return { latestTelemetryById, liveTelemetry, wsStatus, refreshLastTelemetry };
}
