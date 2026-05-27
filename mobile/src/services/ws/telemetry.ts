import { Client, type IMessage } from "@stomp/stompjs";
import { wsBaseUrl } from "../../config/env";
import type { Telemetry } from "../../types/api";

type TelemetryHandler = (data: Telemetry) => void;
type ErrorHandler = (message: string) => void;

export function connectTelemetry(
  token: string,
  onMessage: TelemetryHandler,
  onError?: ErrorHandler
) {
  const client = new Client({
    brokerURL: `${wsBaseUrl}/ws`,
    connectHeaders: {
      Authorization: `Bearer ${token}`
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000
  });

  client.onConnect = () => {
    client.subscribe("/user/queue/telemetry", (message: IMessage) => {
      try {
        const data = JSON.parse(message.body) as Telemetry;
        onMessage(data);
      } catch {
        onError?.("Invalid telemetry payload");
      }
    });
  };

  client.onStompError = (frame) => {
    const message = frame.headers["message"] ?? frame.body ?? "STOMP error";
    onError?.(message);
  };

  client.onWebSocketError = () => {
    onError?.("WebSocket error");
  };

  client.activate();

  return () => {
    client.deactivate();
  };
}
