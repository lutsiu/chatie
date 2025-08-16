import { Icon } from "@iconify/react";

type Props = {
  open: boolean;
  file: File | null;
  caption: string;
  onChangeCaption: (v: string) => void;
  onCancel: () => void;
  onSend: () => void;
};

/* helpers */
const formatBytes = (n: number) => {
  if (n < 1024) return `${n} B`;
  const kb = n / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

const truncateName = (file: File) => {
  const name = file.name;
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return name.length > 28 ? name.slice(0, 25) + "…" : name;
  const base = name.slice(0, dot);
  const ext = name.slice(dot + 1);
  if (base.length <= 20) return `${base}.${ext}`;
  return `${base.slice(0, 17)}….${ext}`;
};

export default function SendFileModal({
  open,
  file,
  caption,
  onChangeCaption,
  onCancel,
  onSend,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000]">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative z-10 w-[44rem] max-w-[94vw] mx-auto mt-[12vh] rounded-[1.2rem] bg-zinc-900 text-white border border-zinc-700 shadow-2xl">
        <div className="flex items-center justify-between px-[1.6rem] py-[1.2rem] border-b border-zinc-800">
          <h3 className="text-[1.6rem] font-semibold">Send File</h3>
          <button onClick={onCancel} className="p-[0.6rem] rounded-full hover:bg-zinc-800">
            <Icon icon="ph:x-bold" className="w-[2rem] h-[2rem] text-zinc-300" />
          </button>
        </div>

        <div className="p-[1.6rem]">
          {file ? (
            <div className="flex items-center gap-[1.2rem] bg-zinc-800/60 rounded-[0.8rem] px-[1rem] py-[0.9rem]">
              <Icon icon="solar:document-linear" className="w-[3.2rem] h-[3.2rem] text-zinc-300" />
              <div className="min-w-0 flex-1">
                <div className="text-[1.4rem] truncate">{truncateName(file)}</div>
                <div className="text-[1.2rem] text-zinc-400">{formatBytes(file.size)}</div>
              </div>
              <button
                onClick={onCancel}
                className="p-[0.4rem] rounded-full hover:bg-zinc-700"
                aria-label="Remove"
                title="Remove"
              >
                <Icon icon="mdi:close" className="w-[2rem] h-[2rem] text-zinc-300" />
              </button>
            </div>
          ) : (
            <div className="text-zinc-400">No file selected</div>
          )}

          <div className="mt-[1.6rem]">
            <input
              value={caption}
              onChange={(e) => onChangeCaption(e.target.value)}
              placeholder="Add a caption…"
              className="w-full bg-transparent border-b border-zinc-700 focus:border-purple-500 outline-none text-[1.4rem] py-[0.6rem] placeholder:text-zinc-400"
            />
          </div>

          <div className="mt-[1.8rem] flex justify-end">
            <button
              onClick={onSend}
              disabled={!file}
              className={`px-[1.4rem] py-[0.8rem] rounded-[0.8rem] text-[1.3rem] font-medium
              ${file ? "bg-purple-600 hover:bg-purple-500" : "bg-zinc-700 cursor-not-allowed"}`}
            >
              SEND
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
