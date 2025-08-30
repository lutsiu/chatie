import { Icon } from "@iconify/react";
import { useChatsStore } from "../../../store/chats";

type Props = {
  chatId: number;
  onClose: () => void;
  position: { x: number; y: number };
};

export default function ChatContextMenu({ chatId, onClose, position }: Props) {
  const remove = useChatsStore((s) => s.remove);
  const selectedId = useChatsStore((s) => s.selectedId);
  const select = useChatsStore((s) => s.select);

  const handleDelete = async () => {
    onClose();
    const ok = window.confirm("Delete this chat? This removes it from your list.");
    if (!ok) return;
    try {
      await remove(chatId);
      if (selectedId === chatId) select(null);
    } catch {
      // you can toast an error here if you like
    }
  };

  return (
    <ul
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
      className="fixed z-50 w-[20rem] bg-zinc-800 rounded-[0.8rem] text-white shadow-lg overflow-hidden"
    >
      <li
        onClick={handleDelete}
        className="flex items-center gap-[1.2rem] hover:bg-zinc-700 duration-100 cursor-pointer py-[1rem] pl-[1.2rem]"
      >
        <Icon icon="solar:trash-bin-trash-linear" width="22" height="22" className="text-red-400" />
        <span className="text-[1.2rem] font-medium text-red-400">Delete Chat</span>
      </li>
    </ul>
  );
}
