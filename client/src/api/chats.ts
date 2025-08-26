import { api } from "./client";

export type Chat = {
  id: number;

  user1Id: number;
  user1Username: string;

  user2Id: number;
  user2Username: string;

  createdAt: string;         // ISO (from LocalDateTime)
  updatedAt: string;

  lastMessageId: number | null;
  lastMessageAt: string | null;      // ISO or null
  lastMessagePreview: string | null;

  user1LastReadAt: string | null;
  user2LastReadAt: string | null;
};

export type CreateChatBody = {
  /** other participant (backend infers me from JWT) */
  otherUserId: number;
};

export const listMyChatsApi = async () => {
  const { data } = await api.get<Chat[]>("/api/chats");
  return data;
};

export const getChatApi = async (id: number) => {
  const { data } = await api.get<Chat>(`/api/chats/${id}`);
  return data;
};

export const getOrCreateChatApi = async (otherUserId: number) => {
  const { data } = await api.post<Chat>("/api/chats", { otherUserId } as CreateChatBody);
  return data;
};

export const deleteChatApi = async (id: number) => {
  await api.delete(`/api/chats/${id}`);
};
