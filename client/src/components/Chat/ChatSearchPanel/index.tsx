import { useEffect, useMemo, useState } from "react";
import { ResultsList } from "./components/ResultsList";
import { EmptyState } from "./components/EmptyState";
import type { Result } from "./types";
import { searchMessagesApi, type Message } from "../../../api/messages";
import { useSelectedChatId } from "../../../store/chats";
import { useMessageRegistry } from "../../../store/useMessageRegistry";

export type Props = {
  query: string;
  setQuery: (q: string) => void;
  onCloseSearch: () => void;      
};

const hhmm = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const initialsAvatar = (seed: string) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed || "User")}`;

const previewOf = (m: Message) => {
  if (m.content && m.content.trim()) return m.content.trim();
  if (m.type === "IMAGE") return "[Photo]";
  if (m.type === "VIDEO") return "[Video]";
  if (m.type === "FILE") return m.attachments[0]?.originalName || "[File]";
  return "[Message]";
};

export default function ChatSearchPanel({ query, setQuery, onCloseSearch }: Props) {
  const chatId = useSelectedChatId();
  const { scrollTo } = useMessageRegistry();

  const q = query.trim();
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chatId || q.length < 2) {
      setItems([]);
      setError(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    const t = setTimeout(async () => {
      try {
        const res = await searchMessagesApi(chatId, q, { limit: 50 });
        if (!cancelled) setItems(res);
      } catch (e: any) {
        if (!cancelled) setError(e?.response?.data?.message || e?.message || "Search failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [chatId, q]);

  const results = useMemo<Result[]>(() => {
    if (!q || !chatId) return [];
    return items.map((m) => ({
      id: m.id,
      name: m.senderUsername,
      text: previewOf(m),
      time: hhmm(m.createdAt),
      date: new Date(m.createdAt).toLocaleDateString(),  
      avatar: initialsAvatar(m.senderUsername || ""),
      onClick: () => scrollTo(m.id),                     
    }));
  }, [items, q, chatId, scrollTo]);

  if (!q) return null;

  return (
    <div className="absolute left-0 right-0 top-[5.6rem] z-30">
      {loading && <div className="px-4 py-3 text-zinc-400">Searching…</div>}
      {error && <div className="px-4 py-3 text-red-400">{error}</div>}
      {!loading && !error && (
        results.length === 0 ? (
          <EmptyState q={q} />
        ) : (
          <ResultsList
            results={results}
            q={q}
            setQuery={setQuery}
            onCloseSearch={onCloseSearch}  
          />
        )
      )}
    </div>
  );
}