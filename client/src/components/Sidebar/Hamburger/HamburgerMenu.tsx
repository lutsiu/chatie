// components/Sidebar/HamburgerMenu.tsx
import { Icon } from "@iconify/react";

type Props = {
  onClose: () => void;
  onOpenSettings: () => void;           // <-- add
  onOpenContacts?: () => void;          // optional, for later
};

export default function HamburgerMenu({
  onClose,
  onOpenSettings,
  onOpenContacts,
}: Props) {
  const goSettings = () => { onClose(); onOpenSettings(); };
  const goContacts = () => { onClose(); onOpenContacts?.(); };

  return (
    <ul className="z-1000 absolute w-[20rem] bg-zinc-800 left-[0.5rem] rounded-[0.8rem] top-[4rem] text-white shadow-lg">
      {/* Profile row -> open Settings */}
      <li
        onClick={goSettings}
        className="flex items-center gap-[2rem] w-full hover:bg-zinc-700 duration-100 cursor-pointer py-[1rem] pl-[1rem] rounded-[0.8rem]"
      >
        <img
          src="https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg"
          alt="user-icon"
          className="w-[2.4rem] h-[2.4rem] rounded-full"
        />
        <span className="text-[1.2rem] font-medium">Oleksandr</span>
      </li>

      {/* Contacts (optional) */}
      <li
        onClick={goContacts}
        className="flex items-center gap-[2rem] w-full hover:bg-zinc-700 duration-100 cursor-pointer py-[1rem] pl-[1rem] rounded-[0.8rem]"
      >
        <Icon icon="hugeicons:user" width="24" height="24" />
        <span className="text-[1.2rem] font-medium">Contacts</span>
      </li>

      {/* Settings */}
      <li
        onClick={goSettings}
        className="flex items-center gap-[2rem] w-full hover:bg-zinc-700 duration-100 cursor-pointer py-[1rem] pl-[1rem] rounded-[0.8rem]"
      >
        <Icon icon="material-symbols-light:settings-outline" width="24" height="24" />
        <span className="text-[1.2rem] font-medium">Settings</span>
      </li>
    </ul>
  );
}
