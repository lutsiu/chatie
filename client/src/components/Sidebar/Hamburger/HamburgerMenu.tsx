import { Icon } from "@iconify/react";

type Props = {
  onClose: () => void;
};

export default function HamburgerMenu({ onClose }: Props) {
  return (
    <ul className="absolute w-[20rem] bg-zinc-800 left-[0.5rem] rounded-[0.8rem] top-[4rem] text-white z-[1000]">
      <li
        onClick={onClose}
        className="flex items-center gap-[2rem] w-full hover:bg-zinc-700 duration-100 cursor-pointer py-[1rem] pl-[1rem] rounded-[0.8rem]"
      >
        <img
          src="https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg"
          alt="user-icon"
          className="w-[2.4rem] h-[2.4rem] rounded-full"
        />
        <span className="text-[1.2rem] font-medium">Oleksandr</span>
      </li>
      <li
        onClick={onClose}
        className="flex items-center gap-[2rem] w-full hover:bg-zinc-700 duration-100 cursor-pointer py-[1rem] pl-[1rem] rounded-[0.8rem]"
      >
        <Icon icon="hugeicons:user" width="24" height="24" />
        <span className="text-[1.2rem] font-medium">Contacts</span>
      </li>
      <li
        onClick={onClose}
        className="flex items-center gap-[2rem] w-full hover:bg-zinc-700 duration-100 cursor-pointer py-[1rem] pl-[1rem] rounded-[0.8rem]"
      >
        <Icon icon="material-symbols-light:settings-outline" width="24" height="24" />
        <span className="text-[1.2rem] font-medium">Settings</span>
      </li>
    </ul>
  );
}
