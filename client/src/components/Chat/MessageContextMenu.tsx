import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

type Props = {
  position: { x: number; y: number };
  onClose: () => void;
  onReply: () => void;
  onCopy?: () => void;        // disabled UI if undefined
  onPin: () => void;
  onDelete: () => void;
};

export default function MessageContextMenu({
  position,
  onClose,
  onReply,
  onCopy,
  onPin,
  onDelete,
}: Props) {
  const menuRef = useRef<HTMLUListElement>(null);
  const [pos, setPos] = useState(position);

  // clamp to viewport so it never overflows
  useLayoutEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pad = 8;
    const x = Math.min(position.x, window.innerWidth - rect.width - pad);
    const y = Math.min(position.y, window.innerHeight - rect.height - pad);
    setPos({ x: Math.max(pad, x), y: Math.max(pad, y) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // close on outside click / escape
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // prevent native context menu over ours
  useEffect(() => {
    const handler = (e: MouseEvent) => e.preventDefault();
    window.addEventListener("contextmenu", handler);
    return () => window.removeEventListener("contextmenu", handler);
  }, []);

  // ensure only one menu is open at a time
  useEffect(() => {
    const closeAll = () => onClose();
    window.addEventListener("close-all-context-menus", closeAll as any);
    return () => window.removeEventListener("close-all-context-menus", closeAll as any);
  }, [onClose]);

  const itemBase =
    "flex items-center gap-[1.2rem] px-[1.2rem] py-[0.9rem] rounded-[0.6rem] select-none";

  return (
    <ul
      ref={menuRef}
      style={{ left: pos.x, top: pos.y }}
      className="fixed z-[1000] w-[20rem] bg-zinc-900 text-white border border-zinc-700 rounded-[0.8rem] shadow-xl p-[0.6rem]"
    >
      <li
        className={`${itemBase} hover:bg-zinc-800 cursor-pointer`}
        onClick={() => { onReply(); onClose(); }}
      >
        <Icon icon="solar:reply-linear" className="w-[2rem] h-[2rem]" />
        <span className="text-[1.35rem]">Reply</span>
      </li>

      <li
        className={`${itemBase} ${onCopy ? "hover:bg-zinc-800 cursor-pointer" : "opacity-40 cursor-not-allowed"}`}
        onClick={() => { if (onCopy) { onCopy(); onClose(); } }}
      >
        <Icon icon="solar:copy-linear" className="w-[2rem] h-[2rem]" />
        <span className="text-[1.35rem]">Copy</span>
      </li>

      <li
        className={`${itemBase} hover:bg-zinc-800 cursor-pointer`}
        onClick={() => { onPin(); onClose(); }}
      >
        <Icon icon="solar:pin-linear" className="w-[2rem] h-[2rem]" />
        <span className="text-[1.35rem]">Pin</span>
      </li>

      <li
        className={`${itemBase} hover:bg-zinc-800 cursor-pointer`}
        onClick={() => { onDelete(); onClose(); }}
      >
        <Icon icon="solar:trash-bin-trash-linear" className="w-[2rem] h-[2rem] text-red-400" />
        <span className="text-[1.35rem] text-red-400">Delete</span>
      </li>
    </ul>
  );
}
