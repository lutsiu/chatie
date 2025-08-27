// src/components/Chat/Composer/AttachmentOverlay.tsx
import { useEffect, useCallback } from "react";
import SendFileModal from "../Modals/SendFileModal";
import SendMediaModal from "../Modals/SendMediaModal";
import { useAttachment } from "../../../store/useAttachment";
import { useSelectedChatId } from "../../../store/chats";
import { useAuthStore } from "../../../store/auth";
import { useMessagesStore } from "../../../store/messages";
import { uploadMessageFilesApi } from "../../../api/messages";

export default function AttachmentOverlay() {
  const { isOpen, mode, files, caption, setCaption, close } = useAttachment();
  const chatId = useSelectedChatId();
  const meId = useAuthStore((s) => s.user?.id ?? null);
  const send = useMessagesStore((s) => s.send);

  // lock scroll + ESC
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  const file = files[0] ?? null;

  const handleSendMedia = useCallback(
    async (data: { files: File[]; caption: string }) => {
      if (!chatId || !meId || data.files.length === 0) return;

      // 1) upload to backend (which uploads to Cloudinary)
      const uploaded = await uploadMessageFilesApi(chatId, data.files, { senderId: meId });

      // 2) choose type based on originals (any video → VIDEO, else IMAGE)
      const anyVideo = data.files.some((f) => f.type.startsWith("video"));

      // 3) send message with Cloudinary URLs
      await send({
        chatId,
        type: anyVideo ? "VIDEO" : "IMAGE",
        content: data.caption || "",
        attachments: uploaded,
      });

      close();
    },
    [chatId, meId, send, close]
  );

  const handleSendFile = useCallback(
    async () => {
      if (!chatId || !meId || !file) return;

      const [uploaded] = await uploadMessageFilesApi(chatId, [file], { senderId: meId });

      await send({
        chatId,
        type: "FILE",
        content: caption || "",
        attachments: [uploaded],
      });

      setCaption("");
      close();
    },
    [chatId, meId, file, caption, setCaption, close, send]
  );

  return (
    <>
      <SendMediaModal
        open={isOpen && mode === "media"}
        files={files}
        onCancel={close}
        onSend={handleSendMedia}
      />
      <SendFileModal
        open={isOpen && mode === "document"}
        file={file}
        caption={caption}
        onChangeCaption={setCaption}
        onCancel={close}
        onSend={handleSendFile}
      />
    </>
  );
}
