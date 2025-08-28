import type { Message } from "../api/messages";

export type WsEvent =
  | { type: "message.created"; payload: Message }
  | { type: "message.edited"; payload: Message }
  | { type: "message.deleted"; payload: Message }
  | { type: "message.pinned"; payload: { chatId: number; messageId: number } }
  | { type: "message.unpinned"; payload: { chatId: number; messageId: number } };

