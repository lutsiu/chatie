import { Icon } from "@iconify/react";

type Props = {
  onClose: () => void;
  position: { x: number; y: number };
};

export default function ChatContextMenu({ onClose, position }: Props) {
  return (
    <ul
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
      className="fixed z-50 w-[20rem] bg-zinc-800 rounded-[0.8rem] text-white shadow-lg"
    >
      <li
        onClick={onClose}
        className="flex items-center gap-[1.6rem] hover:bg-zinc-700 duration-100 cursor-pointer py-[1rem] pl-[1.2rem] rounded-[0.8rem]"
      >
        <Icon icon="iconoir:new-tab" width="22" height="22" />
        <span className="text-[1.2rem] font-medium">Open in new tab</span>
      </li>
      <li
        onClick={onClose}
        className="flex items-center gap-[1.6rem] hover:bg-zinc-700 duration-100 cursor-pointer py-[1rem] pl-[1.2rem] rounded-[0.8rem]"
      >
        <Icon icon="quill:mute" width="22" height="22" />
        <span className="text-[1.2rem] font-medium">Mute</span>
      </li>
      <li
        onClick={onClose}
        className="flex items-center gap-[1.6rem] hover:bg-zinc-700 duration-100 cursor-pointer py-[1rem] pl-[1.2rem] rounded-[0.8rem]"
      >
        <Icon
          icon="solar:trash-bin-trash-linear"
          width="22"
          height="22"
          className="text-red-400"
        />
        <span className="text-[1.2rem] font-medium text-red-400">
          Delete Chat
        </span>
      </li>
    </ul>
  );
}
