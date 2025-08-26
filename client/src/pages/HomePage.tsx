import { Icon } from "@iconify/react";
import ChatWindow from "../components/Chat/ChatWindow";
import { useSelectedChat, useChatsStore } from "../store/chats";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function HomePage() {
  const chat = useSelectedChat();
  const { chatId } = useParams();                    // ← read :chatId
  const select = useChatsStore((s) => s.select);
  const fetch = useChatsStore((s) => s.fetch);
  const hasItems = useChatsStore((s) => s.items.length > 0);

  // Keep store in sync with URL
  useEffect(() => {
    if (chatId) select(Number(chatId));
  }, [chatId, select]);

  // If we landed directly on /:chatId and list is empty -> fetch my chats
  useEffect(() => {
    if (chatId && !hasItems) fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, hasItems]);

  if (!chat) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center text-zinc-400 px-6">
          <Icon icon="solar:chat-round-dots-linear" className="mx-auto mb-4 w-12 h-12" />
          <h2 className="text-white text-[1.8rem] font-semibold mb-1">No chat selected</h2>
          <p className="text-[1.4rem]">Pick a conversation from the left to start messaging.</p>
        </div>
      </div>
    );
  }

  return <ChatWindow />;
}
