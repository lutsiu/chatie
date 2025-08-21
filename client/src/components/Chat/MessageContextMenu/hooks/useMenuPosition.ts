
import { useLayoutEffect, useState, type RefObject } from "react";

export function useMenuPosition<E extends HTMLElement>(
  ref: RefObject<E | null>,                    
  position: { x: number; y: number }
) {
  const [pos, setPos] = useState(position);

  useLayoutEffect(() => {
    const el = ref.current;                   
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const pad = 8;
    const x = Math.min(position.x, window.innerWidth - rect.width - pad);
    const y = Math.min(position.y, window.innerHeight - rect.height - pad);
    setPos({ x: Math.max(pad, x), y: Math.max(pad, y) });
  }, [ref, position.x, position.y]);

  return pos;
}
