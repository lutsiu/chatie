import { useMediaViewer } from "../../../../store/useMediaViewer";
import { useReply } from "../../../../store/useReply";
import { usePinned } from "../../../../store/usePinned";

type Args = {
  id: string | number;
  author: string;
  text?: string;
  media?: { url: string; type: "image" | "video"; id?: string | number }[];
  file?: { url: string; name: string; size: number; mime?: string };
  onPin?: () => void;
};

export function useMessageActions({ id, author, text, media, file, onPin }: Args) {
  const { open } = useMediaViewer();
  const { start: startReply } = useReply();
  const { setPinned } = usePinned();

  const viewerItems =
    media?.map((m, i) => ({
      id: m.id ?? `${m.url}-${i}`,
      url: m.url,
      type: m.type,
    })) ?? [];

  const openViewer = (idx: number) => open(viewerItems, idx);

  const hasMedia = !!media?.length;
  const hasFile = !!file;
  const hasText = !!(text && text.length);
  const copyAvailable = !!text?.trim();

  const getReplyThumb = (items: { url: string; type: "image" | "video" }[]) => {
    const img = items.find((m) => m.type === "image");
    return (img ?? items[0]).url;
  };

  const triggerReply = () => {
    if (hasText) {
      startReply({ id, author, kind: "text", text: text! });
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
        thumb: getReplyThumb(media!),
      });
      return;
    }
    startReply({ id, author, kind: "text", text: "" });
  };

  const triggerPin = onPin
    ? onPin
    : () => {
        if (hasText) {
          setPinned({ id, author, kind: "text", text: text! });
          return;
        }
        if (hasFile) {
          setPinned({ id, author, kind: "file", filename: file!.name });
          return;
        }
        if (hasMedia) {
          const onlyVideo = media!.every((m) => m.type === "video");
          setPinned({
            id,
            author,
            kind: "media",
            label: onlyVideo ? "Video" : "Photo",
            thumb: getReplyThumb(media!),
          });
          return;
        }
        setPinned({ id, author, kind: "text", text: "" });
      };

  return { openViewer, triggerReply, triggerPin, copyAvailable };
}
