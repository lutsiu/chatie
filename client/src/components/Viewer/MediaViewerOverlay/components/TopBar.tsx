import { Icon } from "@iconify/react";

type Props = {
  url: string;
  filename?: string;
  onDelete?: () => void;
  onClose: () => void;
};

export default function TopBar({ url, filename, onDelete, onClose }: Props) {
  return (
    <div className="absolute top-[1.6rem] right-[1.6rem] flex items-center gap-[0.8rem]">
      <a
        href={url}
        download={filename}
        className="p-[0.8rem] rounded-full bg-black/40 hover:bg-black/60"
        aria-label="Download"
      >
        <Icon icon="solar:download-linear" className="w-[2.2rem] h-[2.2rem] text-white" />
      </a>
      <button
        onClick={onDelete}
        disabled={!onDelete}
        className={`p-[0.8rem] rounded-full bg-black/40 hover:bg-black/60 ${!onDelete ? "opacity-40 cursor-not-allowed" : ""}`}
        aria-label="Delete"
      >
        <Icon icon="solar:trash-bin-trash-linear" className="w-[2.2rem] h-[2.2rem] text-red-400" />
      </button>
      <button
        onClick={onClose}
        className="p-[0.8rem] rounded-full bg-black/40 hover:bg-black/60"
        aria-label="Close"
      >
        <Icon icon="ph:x-bold" className="w-[2.2rem] h-[2.2rem] text-white" />
      </button>
    </div>
  );
}
