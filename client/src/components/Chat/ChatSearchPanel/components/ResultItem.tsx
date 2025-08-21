import type { Result } from "../types";
import { highlight } from "../utils/highlight";

type Props = {
  r: Result;
  q: string;
};

export function ResultItem({ r, q }: Props) {
  return (
    <li
      className="flex items-start gap-[1.2rem] px-[1.2rem] py-[1.2rem] hover:bg-zinc-800/70 cursor-pointer"
      role="option"
      aria-label={`${r.name}, ${r.date}`}
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
  );
}
