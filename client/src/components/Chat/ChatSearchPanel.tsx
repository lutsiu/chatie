// components/Chat/ChatSearchPanel.tsx
import { useMemo } from "react";

type Result = {
  id: number;
  avatar: string;
  name: string;
  text: string;
  date: string;
};

const MOCK: Result[] = [
  {
    id: 1,
    avatar:
      "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=200&auto=format&fit=crop",
    name: "Valery",
    text: "Привіт, сорян я напевно не, щось трошки прихворів і не хотів би заразити 😅",
    date: "Aug 10",
  },
  {
    id: 2,
    avatar:
      "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=200&auto=format&fit=crop",
    name: "Valery",
    text: "Привіт, ще ні, але я в школі мав наукову роботу, тому я думав може її використати за основу",
    date: "11/12/2024",
  },
  {
    id: 3,
    avatar:
      "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=200&auto=format&fit=crop",
    name: "Саша",
    text: "Валер, привіт",
    date: "11/12/2024",
  },
];

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "ig"));
  return parts.map((p, i) =>
    p.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="text-purple-400 font-medium">
        {p}
      </span>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

type Props = { query: string };

export default function ChatSearchPanel({ query }: Props) {
  const q = query.trim();
  if (!q) return null;

  const results = useMemo(
    () =>
      MOCK.filter(
        (r) =>
          r.name.toLowerCase().includes(q.toLowerCase()) ||
          r.text.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );

  return (
    <div className="absolute left-0 right-0 top-[5.6rem] z-30">
      {results.length === 0 ? (
        <div className="mx-[1.6rem] rounded-b-[1rem] bg-zinc-900 border border-zinc-800 border-t-0 px-[1.6rem] py-[1.2rem]">
          <div className="text-center text-zinc-300 text-[1.6rem]">
            There were no results for <span className="text-white">"{q}"</span>. Try a new search.
          </div>
        </div>
      ) : (
        <ul className="mx-[1.6rem] rounded-b-[1rem] bg-zinc-900 border border-zinc-800 border-t-0 overflow-hidden">
          {results.map((r) => (
            <li
              key={r.id}
              className="flex items-start gap-[1.2rem] px-[1.2rem] py-[1.2rem] hover:bg-zinc-800/70"
            >
              <img
                src={r.avatar}
                alt={r.name}
                className="w-[3.6rem] h-[3.6rem] rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-[1rem]">
                  <span className="text-white text-[1.5rem] font-medium truncate">{r.name}</span>
                  <span className="text-zinc-400 text-[1.2rem] shrink-0">{r.date}</span>
                </div>
                <div className="text-zinc-300 text-[1.35rem] mt-[0.2rem] line-clamp-2">
                  {highlight(r.text, q)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
