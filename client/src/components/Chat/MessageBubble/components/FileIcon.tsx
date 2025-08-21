import { Icon } from "@iconify/react";

export default function FileIcon({ mime }: { mime?: string }) {
  if (mime?.includes("pdf")) {
    return <Icon icon="mdi:file-pdf-box" className="w-[3rem] h-[3rem] text-red-400" />;
  }
  if (mime?.includes("zip")) {
    return <Icon icon="mdi:folder-zip-outline" className="w-[3rem] h-[3rem]" />;
  }
  return <Icon icon="solar:document-linear" className="w-[3rem] h-[3rem]" />;
}
