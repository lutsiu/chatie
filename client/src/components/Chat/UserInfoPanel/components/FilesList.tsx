import { Icon } from "@iconify/react";

type FileItem = { id: number; name: string; size: string };

export default function FilesList({ files }: { files: FileItem[] }) {
  return (
    <ul className="mt-[1.6rem] space-y-[1rem]">
      {files.map((f) => (
        <li
          key={f.id}
          className="flex items-center justify-between bg-zinc-800/50 rounded-[0.6rem] px-[1rem] py-[0.8rem]"
        >
          <div className="flex items-center gap-[0.8rem]">
            <Icon icon="solar:document-linear" className="w-[2rem] h-[2rem] text-zinc-300" />
            <span className="text-white">{f.name}</span>
          </div>
          <span className="text-[1.2rem] text-zinc-400">{f.size}</span>
        </li>
      ))}
    </ul>
  );
}
