// src/components/Chat/MessageBubble/hooks/useMessageActions.ts
import { useMediaViewer } from "../../../../store/useMediaViewer";
import { useReply } from "../../../../store/useReply";
import { useMessagesStore } from "../../../../store/messages";
import { useSelectedChatId } from "../../../../store/chats";

type MediaItem = { url: string; type: "image" | "video"; id?: string | number };
type FileItem = { url: string; name: string; size: number; mime?: string };

type Args = {
  id: string | number;
  author: string;
  text?: string;
  media?: MediaItem[];
  file?: FileItem;
  /** Optional override if a parent wants custom pin behavior */
  onPin?: () => void;
  /** Optional explicit chatId (otherwise we use the selected chat) */
  chatId?: number | null;
};

export function useMessageActions({ id, author, text, media, file, onPin, chatId }: Args) {
  const { open } = useMediaViewer();
  const { start: startReply } = useReply();
  const storePin = useMessagesStore((s) => s.pin);
  const selectedChatId = useSelectedChatId();
  const effectiveChatId = chatId ?? selectedChatId ?? null;

  // ---------- Viewer ----------
  const viewerItems =
    (media ?? []).map((m, i) => ({
      id: m.id ?? `${m.url}-${i}`,
      url: m.url,
      type: m.type,
    })) ?? [];

  const openViewer = (index: number) => {
    if (!viewerItems.length) return;
    const safe = Math.max(0, Math.min(index, viewerItems.length - 1));
    open(viewerItems, safe);
  };

  // ---------- Helpers ----------
  const hasMedia = !!media?.length;
  const hasFile = !!file;
  const hasText = typeof text === "string" && text.trim().length > 0;
  const copyAvailable = hasText;

  const pickThumb = (items: { url: string; type: "image" | "video" }[]) => {
    const img = items.find((m) => m.type === "image");
    return (img ?? items[0]).url;
  };

  // ---------- Reply ----------
  const triggerReply = () => {
    if (hasText) {
      startReply({ id, author, kind: "text", text: text!.trim() });
      return;
    }
    if (hasFile) {
      startReply({ id, author, kind: "file", filename: file!.name });
      return;
    }
    if (hasMedia) {
      const onlyVideo = media!.every((m) => m.type === "video");
      startReply({
        id,
        author,
        kind: "media",
        label: onlyVideo ? "Video" : "Photo",
        thumb: pickThumb(media!),
      });
      return;
    }
    startReply({ id, author, kind: "text", text: "" });
  };

  // ---------- Pin (default → backend) ----------
  const triggerPin =
    onPin ??
    (async () => {
      if (!effectiveChatId) return;
      await storePin(effectiveChatId, Number(id));
      // Your store's `pin` already calls `fetchPinned(chatId)`, so the banner updates.
    });

  return { openViewer, triggerReply, triggerPin, copyAvailable };
}

export default useMessageActions;
