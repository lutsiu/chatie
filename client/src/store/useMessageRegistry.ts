import { create } from "zustand";

type State = {
  scrollTo: (id: string | number) => void;
};

export const useMessageRegistry = create<State>(() => ({
  scrollTo: (id) => {
    const selector = `[data-message-id="${String(id)}"]`;
    const el = document.querySelector(selector) as HTMLElement | null;

    if (!el) {
      console.log("[registry] message not found in DOM", id);
      return;
    }

    console.log("[registry] scrolling to message", id, el);

    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });

    // highlight for a moment
    el.classList.add(
      "ring-2",
      "ring-purple-500",
      "ring-offset-2",
      "ring-offset-zinc-900"
    );
    setTimeout(() => {
      el.classList.remove(
        "ring-2",
        "ring-purple-500",
        "ring-offset-2",
        "ring-offset-zinc-900"
      );
    }, 1400);
  },
}));
