import { escapeRegExp } from "./escapeRegExp";

/** Returns an array of <span> nodes with matches highlighted */
export function highlight(text: string, rawQuery: string) {
  if (!rawQuery.trim()) return text;

  const rx = new RegExp(`(${escapeRegExp(rawQuery)})`, "ig");
  const parts = text.split(rx);

  return parts.map((p, i) =>
    p.toLowerCase() === rawQuery.toLowerCase() ? (
      <span key={i} className="text-purple-400 font-medium">
        {p}
      </span>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}
