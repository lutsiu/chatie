import { useRef } from "react";
import MenuItem from "./components/MenuItem";
import { useMenuPosition } from "./hooks/useMenuPosition";
import { useMenuGuards } from "./hooks/useMenuGuards";

type Props = {
  position: { x: number; y: number };
  onClose: () => void;
  onReply: () => void;
  onCopy?: () => void;      
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

  const pos = useMenuPosition<HTMLUListElement>(menuRef, position);
  useMenuGuards<HTMLUListElement>(menuRef, onClose);

  return (
    <ul
      ref={menuRef}
      style={{ left: pos.x, top: pos.y }}
      role="menu"
      className="fixed z-[1000] w-[20rem] bg-zinc-900 text-white border border-zinc-700 rounded-[0.8rem] shadow-xl p-[0.6rem]"
    >
      <MenuItem
        icon="solar:reply-linear"
        label="Reply"
        onClick={() => { onReply(); onClose(); }}
      />

      <MenuItem
        icon="solar:copy-linear"
        label="Copy"
        disabled={!onCopy}
        onClick={onCopy ? () => { onCopy(); onClose(); } : undefined}
      />

      <MenuItem
        icon="solar:pin-linear"
        label="Pin"
        onClick={() => { onPin(); onClose(); }}
      />

      <MenuItem
        icon="solar:trash-bin-trash-linear"
        label="Delete"
        danger
        onClick={() => { onDelete(); onClose(); }}
      />
    </ul>
  );
}
