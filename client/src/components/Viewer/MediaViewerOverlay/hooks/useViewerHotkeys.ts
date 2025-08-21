import { useEffect } from "react";

type Actions = {
  close: () => void;
  next: () => void;
  prev: () => void;
};

export function useViewerHotkeys(isOpen: boolean, { close, next, prev }: Actions) {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close, next, prev]);
}
