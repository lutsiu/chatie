import { Icon } from "@iconify/react";
import ChatWindow from "../components/Chat/ChatWindow";
import { useSelectedChat, useChatsStore } from "../store/chats";
import { useEffect } from "react";

export default function HomePage() {  
  const chat = useSelectedChat();
  const fetch = useChatsStore((s) => s.fetch);
  const hasLoaded = useChatsStore((s) => s.hasLoaded);

  // Fetch chats when entering the page (if not loaded yet)
  useEffect(() => {
    if (!hasLoaded) fetch();
  }, [hasLoaded, fetch]);

  // No chat selected → show empty state
  if (!chat) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center text-zinc-400 px-6">
          <Icon
            icon="solar:chat-round-dots-linear"
            className="mx-auto mb-4 w-12 h-12"
          />
          <h2 className="text-white text-[1.8rem] font-semibold mb-1">
            No chat selected
          </h2>
          <p className="text-[1.4rem]">
            Pick a conversation from the left to start messaging.
          </p>
        </div>
      </div>
    );
  }

  return <ChatWindow />;
}
