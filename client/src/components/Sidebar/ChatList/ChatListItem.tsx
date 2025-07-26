import { useEffect, useRef } from "react";
import ChatContextMenu from "./ChatContextMenu";

type Props = {
  id: number;
  name: string;
  message: string;
  time: string;
  avatar: string;
  isRead?: boolean;
  isOwn?: boolean;
  isMenuOpen: boolean;
  menuPosition: { x: number; y: number };
  onOpenContextMenu: (id: number, x: number, y: number) => void;
  onCloseContextMenu: () => void;
};

export default function ChatListItem({
  id,
  name,
  message,
  time,
  avatar,
  isRead = false,
  isOwn = false,
  isMenuOpen,
  menuPosition,
  onOpenContextMenu,
  onCloseContextMenu,
}: Props) {
  const itemRef = useRef<HTMLLIElement>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onOpenContextMenu(id, e.clientX, e.clientY);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!itemRef.current?.contains(e.target as Node)) {
        onCloseContextMenu();
      }
    };

    if (isMenuOpen) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen, onCloseContextMenu]);

  return (
    <li
      onContextMenu={handleContextMenu}
      ref={itemRef}
      className="relative flex gap-[1.2rem] items-center px-[1.5rem] py-[1.1rem] hover:bg-zinc-800 cursor-pointer rounded-[1rem]"
    >
      {/* Avatar */}
      <img
        src={avatar}
        alt={name}
        className="w-[4.5rem] h-[4.5rem] rounded-full object-cover"
      />

      {/* Content */}
      <div className="flex-1 border-b border-zinc-800 pb-[0.4rem]">
        <div className="flex justify-between items-center">
          <span className="text-white font-medium text-[1.5rem]">{name}</span>
          <div className="flex items-center gap-[0.7rem]">
            {isRead && (
              <span className="text-purple-500 text-[1.3rem] ml-[0.6rem]">
                ✔✔
              </span>
            )}
            <span className="text-zinc-400 text-[1.2rem]">{time}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-400 text-[1.3rem] truncate max-w-[15rem]">
            {isOwn ? "You: " : ""}
            {message.length > 30 ? `${message.slice(0, 30)}...` : message}
          </span>
        </div>
      </div>

      {/* Context Menu */}
      {isMenuOpen && (
        <ChatContextMenu onClose={onCloseContextMenu} position={menuPosition} />
      )}
    </li>
  );
}
