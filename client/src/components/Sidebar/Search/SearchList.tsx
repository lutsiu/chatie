/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import SearchListItem from "./SearchListItem";
import { searchUsersApi, type User } from "../../../api/users";
import { useChatsStore } from "../../../store/chats";
import { useAuthStore } from "../../../store/auth";

const initialsAvatar = (seed: string) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed || "User")}`;

type Props = {
  query?: string;            
  onPicked?: () => void;
};

export default function SearchList({ query = "", onPicked }: Props) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const meId = useAuthStore((s) => s.user?.id ?? null);
  const openWith = useChatsStore((s) => s.openWith);

  const q = query.trim();
  console.log(q);

  useEffect(() => {
    if (q.length < 2) {
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
        const res = await searchUsersApi(q, 20);
        if (cancelled) return;
        setItems(res.filter((u) => u.id !== meId));
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.response?.data?.message || e?.message || "Search failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q, meId]);

  const render = useMemo(() => {
    if (loading) {
      return <li className="px-[1.5rem] py-[1.1rem] text-zinc-400">Searching…</li>;
    }
    if (error) {
      return <li className="px-[1.5rem] py-[1.1rem] text-red-400">{error}</li>;
    }
    if (!items.length) {
      return (
        <li className="px-[1.5rem] py-[1.1rem] text-zinc-500">
          {q.length < 2 ? "Type at least 2 characters…" : "No users found."}
        </li>
      );
    }
    return items.map((u) => {
      const full = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
      const name = full || u.username;
      const avatar = u.profilePictureUrl || initialsAvatar(name || u.username);
      return (
        <SearchListItem
          key={u.id}
          name={name}
          username={u.username}
          avatar={avatar}
          onClick={async () => {
            await openWith(u.id);
            onPicked?.();
          }}
        />
      );
    });
  }, [items, loading, error, q, openWith, onPicked]);

  return <ul className="flex flex-col px-[1rem] py-[0.5rem] gap-[0.3rem]">{render}</ul>;
}
