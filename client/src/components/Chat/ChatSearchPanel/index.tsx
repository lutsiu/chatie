import { useMemo } from "react";
import { ResultsList } from "./components/ResultsList";
import { EmptyState } from "./components/EmptyState";
import { MOCK } from "./mock";
import type { Result } from "./types";

export type Props = { query: string };

export default function ChatSearchPanel({ query }: Props) {
  const q = query.trim();

  // Hooks must run unconditionally
  const results = useMemo<Result[]>(() => {
    if (!q) return [];
    const qLower = q.toLowerCase();
    return MOCK.filter(
      (r) => r.name.toLowerCase().includes(qLower) || r.text.toLowerCase().includes(qLower)
    );
  }, [q]);

  if (!q) return null;

  return (
    <div className="absolute left-0 right-0 top-[5.6rem] z-30">
      {results.length === 0 ? <EmptyState q={q} /> : <ResultsList results={results} q={q} />}
    </div>
  );
}
