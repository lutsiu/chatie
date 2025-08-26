import { useEffect, useRef } from "react";
import ChatContextMenu from "./ChatContextMenu";

type Props = {
  id: number;
  name: string;
  message: string;
  time: string;
  avatar: string;
  isSelected?: boolean;
  hasUnread?: boolean;

  // context menu
  isMenuOpen: boolean;
  menuPosition: { x: number; y: number };
  onOpenContextMenu: (id: number, x: number, y: number) => void;
  onCloseContextMenu: () => void;

  // select/open chat
  onClick?: () => void;
};

export default function ChatListItem({
  id,
  name,
  message,
  time,
  avatar,
  isSelected = false,
  hasUnread = false,
  isMenuOpen,
  menuPosition,
  onOpenContextMenu,
  onCloseContextMenu,
  onClick,
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
    if (isMenuOpen) window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen, onCloseContextMenu]);

  return (
    <li
      ref={itemRef}
      onContextMenu={handleContextMenu}
      onClick={onClick}
      className={`relative flex gap-[1.2rem] items-center px-[1.5rem] py-[1.1rem] cursor-pointer rounded-[1rem] transition-colors
        ${isSelected ? "bg-zinc-800/60" : "hover:bg-zinc-800"}`}
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
          <span className="text-white font-medium text-[1.5rem] truncate max-w-[14rem]">
            {name}
          </span>

          <div className="flex items-center gap-[0.7rem]">
            {hasUnread && (
              <span
                className="inline-block w-[0.7rem] h-[0.7rem] rounded-full bg-purple-500"
                title="Unread messages"
              />
            )}
            <span className="text-zinc-400 text-[1.2rem]">{time}</span>
          </div>
        </div>

        <div className="flex items-center">
          <span className="text-zinc-400 text-[1.3rem] truncate max-w-[15rem]">
            {message}
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
