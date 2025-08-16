import { Icon } from "@iconify/react";
import { useRef, useEffect } from "react";
import { useAttachment } from "../../../store/useAttachment";

type Props = {
  onClose: () => void;
  anchorClassName?: string;
};

export default function AttachmentMenu({ onClose, anchorClassName }: Props) {
  const docInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const { open, setFiles } = useAttachment();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const pickDocument = () => {
    docInputRef.current?.click();
  };

  const pickMedia = () => {
    mediaInputRef.current?.click(); // (we’ll support up to 5 later)
  };

  return (
    <>
      {/* Invisible inputs */}
      <input
        ref={docInputRef}
        type="file"
        accept="*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setFiles([f]);
          open("document");
          onClose();
        }}
      />
      <input
        ref={mediaInputRef}
        type="file"
        accept="image/*,video/*"
        hidden
        multiple
        onChange={(e) => {
          const files = e.target.files ? Array.from(e.target.files) : [];
          if (!files.length) return;
          // later: limit to 5, create previews, etc.
          setFiles(files.slice(0, 5));
          open("media");
          onClose();
        }}
      />

      {/* Menu */}
      <div className={`absolute bottom-[4.6rem] right-[0.2rem] z-50 ${anchorClassName ?? ""}`}>
        <ul className="bg-zinc-800 text-white rounded-[0.8rem] shadow-2xl w-[20rem] p-[0.6rem] border border-zinc-700">
          <li
            onClick={pickMedia}
            className="flex items-center gap-[1.2rem] px-[0.8rem] py-[0.9rem] rounded-[0.6rem] hover:bg-zinc-700 cursor-pointer"
          >
            <Icon icon="mdi:image-outline" className="w-[2rem] h-[2rem]" />
            <span>Photo or Video</span>
          </li>
          <li
            onClick={pickDocument}
            className="flex items-center gap-[1.2rem] px-[0.8rem] py-[0.9rem] rounded-[0.6rem] hover:bg-zinc-700 cursor-pointer"
          >
            <Icon icon="mdi:file-outline" className="w-[2rem] h-[2rem]" />
            <span>Document</span>
          </li>
        </ul>
      </div>
    </>
  );
}
