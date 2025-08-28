// src/api/messages.ts
import { api } from "./client";

/* ---------- Types (match backend DTOs) ---------- */

export type MessageType = "TEXT" | "IMAGE" | "VIDEO" | "FILE" | "SYSTEM";

export type Attachment = {
  id: number;
  url: string;
  mime?: string | null;
  sizeBytes?: number | null;
  width?: number | null;
  height?: number | null;
  durationSec?: number | null;
  originalName?: string | null;
  position: number;
};

/** Attachment payload used when creating messages OR returned by /upload */
export type AttachmentInput = {
  url: string;
  mime?: string | null;
  sizeBytes?: number | null;
  width?: number | null;
  height?: number | null;
  durationSec?: number | null;
  originalName?: string | null;
  position?: number | null;
};

export type Message = {
  id: number;
  chatId: number;

  senderId: number;
  senderUsername: string;

  type: MessageType;
  content: string | null;

  replyToId: number | null;
  replyToPreview: string | null;

  createdAt: string;     // ISO
  editedAt: string | null;
  deletedAt: string | null;

  attachments: Attachment[];
};

/** Client-only flag for optimistic UI. Not returned by backend. */
export type MessageLocal = Message & {
  /** "sending" when posted optimistically; "error" if failed; undefined when confirmed */
  _localStatus?: "sending" | "error";
};

export type CreateMessageBody = {
  chatId: number;
  senderId: number;              // until /me is used
  type: MessageType;
  content?: string | null;
  replyToId?: number | null;
  attachments?: AttachmentInput[];
};

export type EditMessageBody = {
  content: string;
};

/* ---------- API calls ---------- */

export const listMessagesApi = async (
  chatId: number,
  opts?: { limit?: number; beforeId?: number }
) => {
  const params: any = {};
  if (opts?.limit != null) params.limit = opts.limit;
  if (opts?.beforeId != null) params.beforeId = opts.beforeId;

  const { data } = await api.get<Message[]>(`/api/messages/by-chat/${chatId}`, {
    params,
  });
  return data;
};

export const createMessageApi = async (body: CreateMessageBody) => {
  const { data } = await api.post<Message>("/api/messages", body);
  return data;
};

export const editMessageApi = async (id: number, body: EditMessageBody) => {
  const { data } = await api.patch<Message>(`/api/messages/${id}`, body);
  return data;
};

export const deleteMessageApi = async (id: number) => {
  await api.delete(`/api/messages/${id}`);
};

export const listPinnedMessagesApi = async (chatId: number) => {
  const { data } = await api.get<Message[]>(`/api/messages/pin/${chatId}`);
  return data;
};

export const pinMessageApi = async (chatId: number, messageId: number, userId: number) => {
  await api.post(`/api/messages/pin`, null, { params: { chatId, messageId, userId } });
};

export const unpinMessageApi = async (chatId: number, messageId: number) => {
  await api.delete(`/api/messages/pin`, { params: { chatId, messageId } });
};

/* ---------- NEW: upload files to backend → Cloudinary ---------- */

export async function uploadMessageFilesApi(
  chatId: number,
  files: File[],
  opts?: { senderId?: number }
): Promise<AttachmentInput[]> {
  const fd = new FormData();
  fd.append("chatId", String(chatId));
  if (opts?.senderId != null) fd.append("senderId", String(opts.senderId));
  files.forEach((f) => fd.append("files", f));

  const { data } = await api.post<AttachmentInput[]>("/api/messages/upload", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}


export const searchMessagesApi = async (
  chatId: number,
  q: string,
  opts?: { limit?: number; beforeId?: number }
) => {
  const params: any = { chatId, q };
  if (opts?.limit != null) params.limit = opts.limit;
  if (opts?.beforeId != null) params.beforeId = opts.beforeId;

  const { data } = await api.get<Message[]>("/api/messages/search", { params });
  return data;
};