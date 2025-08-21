// src/components/Chat/PinnedBanner.tsx
import { Icon } from "@iconify/react";
import { usePinned } from "../../store/usePinned";
import { useMessageRegistry } from "../../store/useMessageRegistry";

export default function PinnedBanner() {
  const { pinned, clearPinned } = usePinned();
  const { scrollTo } = useMessageRegistry();

  if (!pinned) return null;

  return (
    <div className="px-[1.6rem] py-[0.8rem] bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
      <button
        onClick={() => scrollTo(pinned.id)}
        className="min-w-0 flex items-center gap-[0.8rem] text-left"
      >
        <Icon icon="solar:pin-linear" className="w-[1.8rem] h-[1.8rem] text-purple-400 shrink-0" />
        {"thumb" in pinned && pinned.thumb ? (
          <img
            src={pinned.thumb}
            alt=""
            className="w-[3.2rem] h-[3.2rem] rounded-[0.4rem] object-cover shrink-0"
          />
        ) : null}
        <div className="min-w-0">
          <div className="text-white text-[1.35rem] font-semibold truncate">{pinned.author}</div>
          <div className="text-[1.25rem] text-zinc-300 truncate">
            {pinned.kind === "text"
              ? pinned.text
              : pinned.kind === "file"
              ? pinned.filename
              : pinned.label}
          </div>
        </div>
      </button>

      <button
        onClick={clearPinned}
        className="p-[0.5rem] rounded-full hover:bg-zinc-800"
        aria-label="Unpin"
      >
        <Icon icon="ph:x-bold" className="w-[1.6rem] h-[1.6rem] text-zinc-300" />
      </button>
    </div>
  );
}
