import { formatBytes } from "../utils/formatBytes";
import FileIcon from "./FileIcon";

type FileItem = { url: string; name: string; size: number; mime?: string };

export default function FileAttachment({ file, isOwn }: { file: FileItem; isOwn: boolean }) {
  return (
    <a
      href={file.url}
      download={file.name}
      className={`mt-[0.6rem] flex items-center gap-[1rem] rounded-[0.8rem] px-[0.8rem] py-[0.7rem]
                 ${isOwn ? "bg-white/10" : "bg-black/10"}`}
    >
      <FileIcon mime={file.mime} />
      <div className="min-w-0">
        <div className="text-[1.35rem] truncate">{file.name}</div>
        <div className="text-[1.15rem] opacity-80">{formatBytes(file.size)}</div>
      </div>
    </a>
  );
}
