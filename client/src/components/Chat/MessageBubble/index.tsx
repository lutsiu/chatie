import MessageContextMenu from "../MessageContextMenu";
import { useMessageRegistry } from "../../../store/useMessageRegistry";
import { useContextMenu } from "./hooks/useContextMenu";
import { useMessageActions } from "./hooks/useMessageActions";
import ReplyPreview from "./components/ReplyPreview";
import MediaMosaic from "./components/MediaMosaic";
import FileAttachment from "./components/FileAttachment";
import MetaBar from "./components/MetaBar";
import { useSelectedChatId } from "../../../store/chats";
import { useMessagesStore } from "../../../store/messages";
import type { ReplyTarget } from "../../../store/useReply";

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
  onDelete?: () => void; // optional override
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
  const { register, scrollTo } = useMessageRegistry();
  const { menuOpen, menuPos, handleContext, closeMenu } = useContextMenu();
  const { openViewer, triggerReply, triggerPin, copyAvailable } = useMessageActions({
    id,
    author,
    text,
    media,
    file,
    onPin,
  });

  // --- delete wiring (store + chat id) ---
  const chatId = useSelectedChatId();
  const remove = useMessagesStore((s) => s.remove);

  const handleDelete = async () => {
    if (!chatId) return;
    // Simple confirm; replace with a custom modal if you want
    const ok = window.confirm("Delete this message for everyone?");
    if (!ok) return;
    try {
      await remove(chatId, Number(id)); // soft-deletes; UI updates optimistically
    } catch (e) {
      console.error(e);
    }
  };

  const base =
    "max-w-[70%] rounded-[1.2rem] px-[1.2rem] py-[0.8rem] text-[1.45rem] leading-[1.35] shadow-sm my-[1rem]";
  const colors = isOwn ? "bg-purple-600/90 text-white" : "bg-zinc-800 text-zinc-100";

  const hasMedia = !!media?.length;
  const hasFile = !!file;
  const hasText = !!(text && text.length);

  return (
    <div
      ref={register(id)}
      className={`w-full flex ${isOwn ? "justify-end" : "justify-start"} px-[1.6rem]`}
      onContextMenu={handleContext}
    >
      <div className={`${base} ${colors} relative`}>
        {/* Reply preview (click to jump) */}
        {reply && (
          <ReplyPreview
            reply={reply}
            isOwn={!!isOwn}
            onJump={() => scrollTo(reply.id)}
          />
        )}

        {/* Media */}
        {hasMedia && (
          <MediaMosaic
            items={media!.map((m) => ({ url: m.url, type: m.type }))}
            onOpen={openViewer}
          />
        )}

        {/* File */}
        {hasFile && <FileAttachment file={file!} isOwn={!!isOwn} />}

        {/* Text */}
        {hasText && (
          <p
            className={`whitespace-pre-wrap break-words ${
              hasMedia || hasFile ? "mt-[0.6rem]" : ""
            }`}
          >
            {text}
          </p>
        )}

        {/* Time + status */}
        <MetaBar time={time} status={status} isOwn={!!isOwn} />
      </div>

      {/* Context menu */}
      {menuOpen && (
        <MessageContextMenu
          position={menuPos}
          onClose={closeMenu}
          onReply={triggerReply}
          onCopy={
            copyAvailable
              ? async () => {
                  try {
                    await navigator.clipboard.writeText(text!);
                  } catch {
                    console.log("Couldn't copy text properly…");
                  }
                }
              : undefined
          }
          onPin={onPin ?? triggerPin}
          onDelete={onDelete ?? handleDelete}
        />
      )}
    </div>
  );
}
