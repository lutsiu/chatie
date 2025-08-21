
import { useEffect, type RefObject } from "react";

const CLOSE_ALL_EVENT = "close-all-context-menus" as const;

export function useMenuGuards<E extends HTMLElement>(
  ref: RefObject<E | null>,                    
  onClose: () => void
) {
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const preventNative = (e: MouseEvent) => e.preventDefault();
    const closeAll: EventListener = () => onClose();

    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("contextmenu", preventNative);
    window.addEventListener(CLOSE_ALL_EVENT, closeAll);

    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("contextmenu", preventNative);
      window.removeEventListener(CLOSE_ALL_EVENT, closeAll);
    };
  }, [ref, onClose]);
}
