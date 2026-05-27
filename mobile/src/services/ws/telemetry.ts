import { Client, type IMessage } from "@stomp/stompjs";
import { wsBaseUrl } from "../../config/env";
import type { Telemetry } from "../../types/api";

type TelemetryHandler = (data: Telemetry) => void;
type ErrorHandler = (message: string) => void;
type StatusHandler = () => void;

export function connectTelemetry(
  token: string,
  onMessage: TelemetryHandler,
  onError?: ErrorHandler,
  onConnect?: StatusHandler,
  onDisconnect?: StatusHandler
) {
  const protocol = "v12.stomp";
  const wsUrl = `${wsBaseUrl}/ws`;
  const host =
    (() => {
      try {
        return new URL(wsUrl).host;
      } catch {
        return "localhost";
      }
    })();
  const client = new Client({
    brokerURL: undefined,
    webSocketFactory: () => {
      const socket = new WebSocket(wsUrl, protocol);
      socket.binaryType = "arraybuffer";
      return socket;
    },
    connectHeaders: {
      host,
      Authorization: `Bearer ${token}`,
      token
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    forceBinaryWSFrames: true,
    appendMissingNULLonIncoming: true
  });

  client.debug = (message) => {
    if (__DEV__) {
      console.log(`[stomp] ${message}`);
    }
  };

  client.onConnect = () => {
    onConnect?.();
    client.subscribe("/user/queue/telemetry", (message: IMessage) => {
      try {
        const data = JSON.parse(message.body) as Telemetry;
        onMessage(data);
      } catch {
        onError?.("Invalid telemetry payload");
      }
    });
  };

  client.onDisconnect = () => {
    onDisconnect?.();
  };

  client.onStompError = (frame) => {
    const message = frame.headers["message"] ?? frame.body ?? "STOMP error";
    onError?.(message);
  };

  client.onWebSocketError = () => {
    onError?.("WebSocket error");
  };

  client.onWebSocketClose = () => {
    onDisconnect?.();
    onError?.("WebSocket closed");
  };

  client.activate();

  return () => {
    client.deactivate();
  };
}
