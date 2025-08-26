import { useEffect, useMemo, useState } from "react";
import ChatListItem from "./ChatListItem";
import { useChatsStore } from "../../../store/chats";
import { useAuthStore } from "../../../store/auth";

function hhmm(ts?: string | null) {
  if (!ts) return "";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatList() {
  const { items, loading, error, fetch, select, selectedId } = useChatsStore();
  const meId = useAuthStore((s) => s.user?.id ?? null);

  const [openId, setOpenId] = useState<number | null>(null);
  const [contextPos, setContextPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // guarded inside store (hasLoaded) — safe even if StrictMode double-invokes effects
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const list = useMemo(() => items, [items]);

  if (loading) return <ul className="flex flex-col"><li className="px-[1.5rem] py-[1.1rem] text-zinc-400">Loading…</li></ul>;
  if (error)   return <ul className="flex flex-col"><li className="px-[1.5rem] py-[1.1rem] text-red-400">{error}</li></ul>;
  if (!list.length) return <ul className="flex flex-col"><li className="px-[1.5rem] py-[1.1rem] text-zinc-400">No chats yet.</li></ul>;

  return (
    <ul className="flex flex-col">
      {list.map((c) => {
        const otherUsername =
          meId && c.user1Id === meId ? c.user2Username : c.user1Username;

        const avatar = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(otherUsername || "User")}`;
        const preview = c.lastMessagePreview || "No messages yet";
        const time = hhmm(c.lastMessageAt || c.updatedAt || c.createdAt);

        const myLastRead =
          meId && c.user1Id === meId ? c.user1LastReadAt : c.user2LastReadAt;
        const hasUnread =
          !!c.lastMessageAt &&
          (!!myLastRead ? new Date(c.lastMessageAt) > new Date(myLastRead) : true);

        return (
          <ChatListItem
            key={c.id}
            id={c.id}
            name={otherUsername}
            message={preview}
            time={time}
            avatar={avatar}
            isSelected={selectedId === c.id}
            hasUnread={hasUnread}
            isMenuOpen={openId === c.id}
            menuPosition={contextPos}
            onOpenContextMenu={(id, x, y) => {
              setOpenId(id);
              setContextPos({ x, y });
            }}
            onCloseContextMenu={() => setOpenId(null)}
            onClick={() => select(c.id)}   // idempotent now
          />
        );
      })}
    </ul>
  );
}
