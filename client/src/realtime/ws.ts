import "../polyfills/global";
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuthStore } from "../store/auth";
import { api } from "../api/client";

let client: Client | null = null;

/** Resolve absolute base for SockJS without env vars */
function resolveApiBase(): string {
  const fromAxios = (api as any)?.defaults?.baseURL as string | undefined;
  // prefer absolute axios baseURL if present
  if (fromAxios && /^https?:\/\//i.test(fromAxios)) return fromAxios.replace(/\/+$/, "");
  // fall back to current origin (works with same-origin/proxy setups)
  if (typeof window !== "undefined") return window.location.origin;
  // SSR fallback: relative (some hosts will still accept it)
  return "";
}

export function getWsClient(): Client {
  if (client) return client;

  const base = resolveApiBase();              // e.g. http://localhost:8080
  const sockUrl = `${base}/ws`;               // SockJS endpoint from Spring config

  client = new Client({
    webSocketFactory: () => new SockJS(sockUrl),
    reconnectDelay: 4000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    debug: () => {}, // silence logs; flip on for debugging
  });

  client.beforeConnect = () => {
    const token =
      useAuthStore.getState().accessToken ||
      (useAuthStore.getState() as any).token ||
      "";
    client!.connectHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  };

  client.onStompError = (frame) => {
    console.error("STOMP error:", frame.headers["message"], frame.body);
  };
  client.onWebSocketError = (e) => {
    console.error("WebSocket error:", e);
  };

  return client;
}

export function activateWs() {
  const c = getWsClient();
  if (!c.active) c.activate();
}

export function deactivateWs() {
  if (client?.active) client.deactivate();
}

export function subscribeTopic(
  destination: string,
  handler: (msg: IMessage) => void
): () => void {
  const c = getWsClient();
  let sub: StompSubscription | null = null;

  const doSub = () => {
    try {
      sub = c.subscribe(destination, handler);
    } catch (e) {
      console.error("Subscribe failed:", e);
    }
  };

  if (c.connected) {
    doSub();
  } else {
    const prev = c.onConnect;
    c.onConnect = (frame) => {
      prev?.(frame);
      doSub();
      c.onConnect = prev || null!;
    };
    activateWs();
  }

  return () => sub?.unsubscribe();
}
