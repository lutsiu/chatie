import { useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { useSelectedChatId } from "../../store/chats";
import { useMessagesStore } from "../../store/messages";
import { useMessageRegistry } from "../../store/useMessageRegistry";

/** Build a small preview for the banner from a server Message. */
function toBannerPreview(m: {
  id: number;
  senderUsername: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "FILE" | "SYSTEM";
  content: string | null;
  attachments: Array<{
    url: string;
    mime?: string | null;
    originalName?: string | null;
  }>;
}) {
  if (m.type === "TEXT") {
    const txt = (m.content ?? "").trim();
    return { author: m.senderUsername, kind: "text" as const, text: txt || "(empty)" };
  }
  if (m.type === "FILE") {
    const a = m.attachments[0];
    const name = a?.originalName || "file";
    return { author: m.senderUsername, kind: "file" as const, filename: name };
  }
  if (m.type === "IMAGE" || m.type === "VIDEO") {
    const a = m.attachments[0];
    const label = m.type === "VIDEO" ? "Video" : "Photo";
    // show thumb only for images (videos would need a generated thumbnail)
    const thumb = m.type === "IMAGE" ? a?.url : undefined;
    return { author: m.senderUsername, kind: "media" as const, label, thumb };
  }
  // fallback for SYSTEM/unknown
  return { author: m.senderUsername, kind: "text" as const, text: "[Message]" };
}

export default function PinnedBanner() {
  const chatId = useSelectedChatId();
  const { scrollTo } = useMessageRegistry();

  const fetchPinned = useMessagesStore((s) => s.fetchPinned);
  const unpin       = useMessagesStore((s) => s.unpin);

  // read bucket
  const bucket = useMessagesStore((s) => (chatId ? s.pinned[chatId] : undefined));
  const loading = bucket?.loading ?? false;
  const list = bucket?.items ?? [];

  // initial fetch (and refetch on chat change)
  useEffect(() => {
    if (chatId) fetchPinned(chatId);
  }, [chatId, fetchPinned]);

  // show the most recently pinned message (index 0 per your repository order)
  const top = useMemo(() => (list.length ? list[0] : null), [list]);

  if (!chatId || loading || !top) return null;

  const preview = toBannerPreview(top);
 
  const handleGoTo = () => scrollTo(top.id);
  const handleUnpin = async () => {
    await unpin(chatId, top.id);
    // fetchPinned is already called inside `unpin` in your store; if not, you can call it here.
  };

  return (
    <div className="px-[1.6rem] py-[0.8rem] bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
      <button onClick={handleGoTo} className="min-w-0 flex items-center gap-[0.8rem] text-left">
        <Icon icon="solar:pin-linear" className="w-[1.8rem] h-[1.8rem] text-purple-400 shrink-0" />
        {"thumb" in preview && preview.thumb ? (
          <img
            src={preview.thumb}
            alt=""
            className="w-[3.2rem] h-[3.2rem] rounded-[0.4rem] object-cover shrink-0"
          />
        ) : null}
        <div className="min-w-0">
          <div className="text-white text-[1.35rem] font-semibold truncate">{preview.author}</div>
          <div className="text-[1.25rem] text-zinc-300 truncate">
            {preview.kind === "text"
              ? preview.text
              : preview.kind === "file"
              ? preview.filename
              : preview.label}
          </div>
        </div>
      </button>

      <button onClick={handleUnpin} className="p-[0.5rem] rounded-full hover:bg-zinc-800" aria-label="Unpin">
        <Icon icon="ph:x-bold" className="w-[1.6rem] h-[1.6rem] text-zinc-300" />
      </button>
    </div>
  );
}
