import { useEffect } from "react";
import { subscribeTopic, activateWs } from "./ws";
import type { WsEvent } from "./types";
import { useMessagesStore } from "../store/messages";

/**
 * Subscribes to /topic/chats.{chatId} and routes events into stores.
 * Call this once per mounted chat window (e.g., inside ChatWindow).
 */
export function useChatChannel(chatId: number | null) {
  useEffect(() => {
    if (!chatId) return;

    // Ensure the socket is up
    activateWs();

    const topic = `/topic/chats.${chatId}`;
    const unsub = subscribeTopic(topic, (msg) => {
      try {
        const ev: WsEvent = JSON.parse(msg.body);
        switch (ev.type) {
          case "message.created":
          case "message.edited":
          case "message.deleted": {
            // Payload is a Message DTO from backend
            const m = ev.payload;
            if (m?.chatId === chatId) {
              useMessagesStore.getState().applyIncoming(m);
            }
            break;
          }

          case "message.pinned":
          case "message.unpinned": {
            // Simply refresh pinned list for this chat
            useMessagesStore
              .getState()
              .fetchPinned(chatId)
              .catch(() => {});
            break;
          }

          default:
            // ignore unknown types
            break;
        }
      } catch (e) {
        console.error("Bad WS payload:", e, msg.body);
      }
    });

    return () => {
      unsub();
    };
  }, [chatId]);
}
