// src/components/Chat/Composer/AttachmentOverlay.tsx
import { useEffect } from "react";
import SendFileModal from "../Modals/SendFileModal";
import SendMediaModal from "../Modals/SendMediaModal";
import { useAttachment } from "../../../store/useAttachment";

export default function AttachmentOverlay() {
  const {
    isOpen,
    mode,          // 'document' | 'media' | null
    files,
    caption,       // used for file flow only
    setCaption,
    close,
  } = useAttachment();

  // Lock scroll + ESC while any attachment modal is open
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

  // Media: expects a single object { files, caption }
  const handleSendMedia = (data: { files: File[]; caption: string }) => {
    console.log("MEDIA SEND", data);
    close();
  };

  // File: uses store caption
  const handleSendFile = () => {
    console.log("FILE SEND", { file, caption });
    close();
  };

  return (
    <>
      {/* Media modal (no caption prop; it manages its own caption) */}
      <SendMediaModal
        open={isOpen && mode === "media"}
        files={files}
        onCancel={close}
        onSend={handleSendMedia}
      />

      {/* File modal (uses caption from attachment store) */}
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
