import type { Chat } from "../api/chats";
import { useChatsStore } from "../store/chats";

export function chatPeerAvatar(c: Chat) {
  const otherName = useChatsStore.getState().otherUsername(c) || "User";
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(otherName)}`;
}
