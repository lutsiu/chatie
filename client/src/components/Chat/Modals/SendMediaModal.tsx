import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import MediaMosaic from "./MediaMosaic";

type Props = {
  open: boolean;
  files: File[];                 // images/videos (max 5)
  onCancel: () => void;
  onSend: (data: { files: File[]; caption: string }) => void;
};

export default function SendMediaModal({ open, files, onCancel, onSend }: Props) {
  const [caption, setCaption] = useState("");

  // Create object-URL previews and clean up on unmount/changes
  const previews = useMemo(() => {
    return files.map((f) => ({
      url: URL.createObjectURL(f),
      type: f.type.startsWith("video") ? "video" : "image" as "video" | "image",
    }));
  }, [files]);

  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!open) return null;

  const label =
    files.length === 1
      ? (files[0].type.startsWith("video") ? "Send Video" : "Send Photo")
      : `Send ${files.length} ${files.every(f => f.type.startsWith("video")) ? "Videos" : "Photos"}`;

  return (
    <div className="fixed inset-0 z-[1000]">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[min(92vw,56rem)] rounded-[1.2rem] bg-zinc-900 text-white
                      shadow-2xl border border-zinc-800 overflow-hidden">

        {/* Header */}
        <div className="h-[5.6rem] px-[1.6rem] flex items-center justify-between">
          <div className="flex items-center gap-[1rem]">
            <button onClick={onCancel} className="p-[0.6rem] rounded-full hover:bg-zinc-800">
              <Icon icon="ph:x-bold" className="w-[2rem] h-[2rem] text-zinc-300" />
            </button>
            <h3 className="text-[1.7rem] font-semibold">{label}</h3>
          </div>
          <button className="p-[0.6rem] rounded-full hover:bg-zinc-800">
            <Icon icon="solar:menu-dots-bold" className="w-[2rem] h-[2rem] text-zinc-300" />
          </button>
        </div>

        {/* Mosaic preview */}
        <div className="px-[1.2rem] pb-[1.2rem]">
          <MediaMosaic items={previews} />
        </div>

        {/* Caption + SEND */}
        <div className="flex items-center gap-[1rem] p-[1.2rem] bg-zinc-900 border-t border-zinc-800">
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption..."
            className="flex-1 bg-zinc-800 rounded-[0.9rem] px-[1.4rem] py-[0.9rem] outline-none
                       text-[1.4rem] placeholder:text-zinc-400"
          />
          <button
            onClick={() => onSend({ files, caption })}
            className="px-[1.6rem] h-[3.6rem] rounded-[0.9rem] bg-purple-600 hover:bg-purple-500 text-white text-[1.35rem] font-semibold disabled:opacity-50"
            disabled={files.length === 0}
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
