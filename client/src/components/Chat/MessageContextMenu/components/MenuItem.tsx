import { Icon } from "@iconify/react";

type Props = {
  icon: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
};

export default function MenuItem({ icon, label, onClick, disabled, danger }: Props) {
  const base =
    "flex items-center gap-[1.2rem] px-[1.2rem] py-[0.9rem] rounded-[0.6rem] select-none";
  const state = disabled
    ? "opacity-40 cursor-not-allowed"
    : "hover:bg-zinc-800 cursor-pointer";
  const color = danger ? "text-red-400" : "";

  return (
    <li
      role="menuitem"
      className={`${base} ${state}`}
      onClick={disabled ? undefined : onClick}
    >
      <Icon icon={icon} className={`w-[2rem] h-[2rem] ${color}`} />
      <span className={`text-[1.35rem] ${color}`}>{label}</span>
    </li>
  );
}
