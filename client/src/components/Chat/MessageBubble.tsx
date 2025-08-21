import { Icon } from "@iconify/react";
import { useState } from "react";
import MessageContextMenu from "./MessageContextMenu";
import { useMediaViewer } from "../../store/useMediaViewer";
import { useReply, type ReplyTarget } from "../../store/useReply";
import { usePinned } from "../../store/usePinned";
import { useMessageRegistry } from "../../store/useMessageRegistry";

type Media = { url: string; type: "image" | "video"; id?: string | number };
type FileItem = { url: string; name: string; size: number; mime?: string };

type Props = {
  id: string | number;
  author: string;
  text?: string;
  time: string;
  isOwn?: boolean;
  status?: "sent" | "delivered" | "read";
  media?: Media[];
  file?: FileItem;
  /** reply preview must match the store union exactly */
  reply?: ReplyTarget;
  onPin?: () => void;
  onDelete?: () => void;
};

export default function MessageBubble({
  id,
  author,
  text,
  time,
  isOwn,
  status,
  media,
  file,
  reply,
  onPin,
  onDelete,
}: Props) {
  const { open } = useMediaViewer();
  const { start: startReply } = useReply();
  const { setPinned } = usePinned();
  const { register, scrollTo } = useMessageRegistry();

  const base =
    "max-w-[70%] rounded-[1.2rem] px-[1.2rem] py-[0.8rem] text-[1.45rem] leading-[1.35] shadow-sm my-[1rem]";
  const colors = isOwn ? "bg-purple-600/90 text-white" : "bg-zinc-800 text-zinc-100";

  const hasMedia = !!media?.length;
  const hasFile = !!file;
  const hasText = !!(text && text.length);

  // Media viewer items
  const viewerItems =
    media?.map((m, i) => ({
      id: m.id ?? `${m.url}-${i}`,
      url: m.url,
      type: m.type,
    })) ?? [];

  const openViewer = (idx: number) => open(viewerItems, idx);

  // Context menu control
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  const handleContext = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new Event("close-all-context-menus"));
    setMenuPos({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
  };

  const copyAvailable = !!text?.trim();

  // Pick a thumbnail for media replies/pins (prefer an image)
  const getReplyThumb = (items: Media[]) => {
    const img = items.find((m) => m.type === "image");
    return (img ?? items[0]).url;
  };

  // Build the exact ReplyTarget and push to store
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
    // fallback
    startReply({ id, author, kind: "text", text: "" });
  };

  // Pin uses the same shape as ReplyTarget
  const triggerPin = () => {
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

  return (
    <div
      ref={register(id)}
      className={`w-full flex ${isOwn ? "justify-end" : "justify-start"} px-[1.6rem]`}
      onContextMenu={handleContext}
    >
      <div className={`${base} ${colors} relative`}>
        {/* Reply preview (click to jump) */}
        {reply && (
          <button
            onClick={() => scrollTo(reply.id)}
            className={`w-full text-left mb-[0.6rem] rounded-[0.8rem] px-[0.8rem] py-[0.6rem] flex items-start gap-[0.8rem]
                        border-l-[0.25rem] ${isOwn ? "border-green-300 bg-black/10" : "border-green-500 bg-white/5"}`}
          >
            {"thumb" in reply && reply.thumb ? (
              <img
                src={reply.thumb}
                alt=""
                className="w-[3.2rem] h-[3.2rem] rounded-[0.4rem] object-cover shrink-0"
              />
            ) : null}
            <div className="min-w-0">
              <div className="text-white font-semibold text-[1.25rem] truncate">{reply.author}</div>
              <div className="text-[1.25rem] opacity-90 truncate">
                {reply.kind === "text"
                  ? reply.text
                  : reply.kind === "file"
                  ? reply.filename
                  : reply.label}
              </div>
            </div>
          </button>
        )}

        {/* Media */}
        {hasMedia && <MediaMosaic items={media!} onOpen={openViewer} />}

        {/* File */}
        {hasFile && (
          <a
            href={file!.url}
            download={file!.name}
            className={`mt-[0.6rem] flex items-center gap-[1rem] rounded-[0.8rem] px-[0.8rem] py-[0.7rem]
                       ${isOwn ? "bg-white/10" : "bg-black/10"}`}
          >
            <FileIcon mime={file!.mime} />
            <div className="min-w-0">
              <div className="text-[1.35rem] truncate">{file!.name}</div>
              <div className="text-[1.15rem] opacity-80">{formatBytes(file!.size)}</div>
            </div>
          </a>
        )}

        {/* Text */}
        {hasText && (
          <p className={`whitespace-pre-wrap break-words ${hasMedia || hasFile ? "mt-[0.6rem]" : ""}`}>
            {text}
          </p>
        )}

        {/* Time + status */}
        <div className="flex items-center gap-[0.4rem] mt-[0.6rem] justify-end">
          <span className="text-[1.1rem] opacity-80">{time}</span>
          {isOwn && (
            <span className="text-[1.3rem]">
              {status === "read" && <Icon icon="solar:double-check-linear" />}
              {status === "delivered" && <Icon icon="solar:check-read-line-duotone" />}
              {status === "sent" && <Icon icon="solar:check-line-duotone" />}
            </span>
          )}
        </div>
      </div>

      {/* Context menu */}
      {menuOpen && (
        <MessageContextMenu
          position={menuPos}
          onClose={() => setMenuOpen(false)}
          onReply={triggerReply}
          onCopy={
            copyAvailable
              ? async () => {
                  try { await navigator.clipboard.writeText(text!); } catch {}
                }
              : undefined
          }
          onPin={onPin ?? triggerPin}
          onDelete={onDelete ?? (() => console.log("delete", id))}
        />
      )}
    </div>
  );
}

/* ---------- helpers & subviews ---------- */

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  const kb = n / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function FileIcon({ mime }: { mime?: string }) {
  if (mime?.includes("pdf")) return <Icon icon="mdi:file-pdf-box" className="w-[3rem] h-[3rem] text-red-400" />;
  if (mime?.includes("zip")) return <Icon icon="mdi:folder-zip-outline" className="w-[3rem] h-[3rem]" />;
  return <Icon icon="solar:document-linear" className="w-[3rem] h-[3rem]" />;
}

/** Clickable media mosaic (1–4+, with +N badge on the last tile if more than 4) */
function MediaMosaic({
  items,
  onOpen,
}: {
  items: { url: string; type: "image" | "video" }[];
  onOpen: (startIndex: number) => void;
}) {
  const count = items.length;

  const Tile = ({
    i,
    className = "",
    showOverlay = false,
    overlayText,
  }: {
    i: number;
    className?: string;
    showOverlay?: boolean;
    overlayText?: string;
  }) => {
    const m = items[i];
    return (
      <button
        onClick={() => onOpen(i)}
        className={`relative w-full h-full overflow-hidden rounded-[0.8rem] bg-black/20 ${className}`}
      >
        {m.type === "image" ? (
          <img src={m.url} alt="" className="w-full h-full object-cover" />
        ) : (
          <video src={m.url} className="w-full h-full object-cover" />
        )}
        {showOverlay && (
          <div className="absolute inset-0 bg-black/50 grid place-items-center">
            <span className="text-white text-[1.6rem] font-semibold">{overlayText}</span>
          </div>
        )}
      </button>
    );
  };

  if (count === 1) {
    return (
      <div className="w-[min(64rem,72vw)]">
        <Tile i={0} className="aspect-[16/10]" />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-[0.6rem] w-[min(64rem,72vw)]">
        <Tile i={0} className="aspect-[1/1]" />
        <Tile i={1} className="aspect-[1/1]" />
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="grid grid-cols-2 gap-[0.6rem] w-[min(64rem,72vw)]">
        <Tile i={0} className="row-span-2 aspect-[2/3]" />
        <Tile i={1} className="aspect-[1/1]" />
        <Tile i={2} className="aspect-[1/1]" />
      </div>
    );
  }

  // 4 or more → 2x2, last tile shows +N if there are extras
  return (
    <div className="grid grid-cols-2 gap-[0.6rem] w-[min(64rem,72vw)]">
      <Tile i={0} className="aspect-[1/1]" />
      <Tile i={1} className="aspect-[1/1]" />
      <Tile i={2} className="aspect-[1/1]" />
      <Tile
        i={3}
        className="aspect-[1/1]"
        showOverlay={items.length > 4}
        overlayText={items.length > 4 ? `+${items.length - 4}` : undefined}
      />
    </div>
  );
}
