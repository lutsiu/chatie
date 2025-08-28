import type { Result } from "../types";
import { ResultItem } from "./ResultItem";

type Props = {
  results: Result[];
  q: string;
  setQuery: (q: string) => void;
};

export function ResultsList({ results, q, setQuery }: Props) {
  return (
    <ul
      className="mx-[1.6rem] rounded-b-[1rem] bg-zinc-900 border border-zinc-800 border-t-0 overflow-hidden"
      role="listbox"
      aria-label="Search results"
    >
      {results.map((r) => (
        <ResultItem key={r.id} r={r} q={q} setQuery={setQuery} />
      ))}
    </ul>
  );
}
