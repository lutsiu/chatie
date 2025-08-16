import { Icon } from "@iconify/react";

type Props = { onClose: () => void };

export default function ChatHeaderMenu({ onClose }: Props) {
  const Item = ({
    icon,
    label,
    danger,
    onClick,
  }: {
    icon: string;
    label: string;
    danger?: boolean;
    onClick: () => void;
  }) => (
    <li
      onClick={onClick}
      className={`flex items-center gap-[1.2rem] px-[1.2rem] py-[0.9rem] cursor-pointer 
                  hover:bg-zinc-700/70 duration-100 ${danger ? "text-red-400" : "text-white"}`}
      role="menuitem"
      tabIndex={0}
    >
      <Icon
        icon={icon}
        className={`w-[2rem] h-[2rem] ${danger ? "text-red-400" : "text-zinc-200"}`}
      />
      <span className="text-[1.35rem] font-medium">{label}</span>
    </li>
  );

  return (
    <ul
      role="menu"
      className="absolute right-0 top-[5.1rem] mt-[0.6rem] w-[20rem] rounded-[0.8rem]
                 bg-zinc-800/95 text-white shadow-lg border border-zinc-700/50 overflow-hidden z-50"
    >
      <Item icon="quill:mute" label="Mute" onClick={onClose} />
      <Item icon="mdi:user-block" label="Block user" onClick={onClose} />
      <Item
        icon="solar:trash-bin-trash-linear"
        label="Delete Chat"
        danger
        onClick={onClose}
      />
    </ul>
  );
}
