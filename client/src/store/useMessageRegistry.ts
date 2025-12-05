import { create } from "zustand";

const nodes = new Map<string | number, HTMLDivElement>();

type State = {
  register: (id: string | number) => (el: HTMLDivElement | null) => void;
  scrollTo: (id: string | number) => void;
};

export const useMessageRegistry = create<State>(() => ({
  register: (id) => (el) => {
    if (el) nodes.set(id, el);
    else nodes.delete(id);
  },
  scrollTo: (id) => {
    const el = nodes.get(id);
    console.log(el);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("ring-2", "ring-purple-500", "ring-offset-2", "ring-offset-zinc-900");
    window.setTimeout(() => {
      el.classList.remove("ring-2", "ring-purple-500", "ring-offset-2", "ring-offset-zinc-900");
    }, 1400);
  },
}));
