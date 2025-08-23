import { Icon } from "@iconify/react";
import { useAuthStore } from "../../../store/auth";

type Props = {
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenContacts?: () => void;
};

const AVATAR_FALLBACK =
  "data:image/svg+xml;utf8,\
  <svg xmlns='http://www.w3.org/2000/svg' width='112' height='112'>\
    <rect width='100%' height='100%' rx='56' fill='%231f2937'/>\
    <text x='50%' y='53%' font-family='Inter,system-ui' font-size='44' text-anchor='middle' fill='%23ffffff'>?</text>\
  </svg>";

export default function HamburgerMenu({
  onClose,
  onOpenSettings,
  onOpenContacts,
}: Props) {
  const user = useAuthStore((s) => s.user);

  const goSettings = () => {
    onClose();
    onOpenSettings();
  };
  const goContacts = () => {
    onClose();
    onOpenContacts?.();
  };

  const displayName =
    (user?.firstName || user?.lastName)
      ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
      : user?.username ?? "My profile";

  const avatar = user?.profilePictureUrl || AVATAR_FALLBACK;

  return (
    <ul className="z-[1000] absolute w-[20rem] bg-zinc-800 left-[0.5rem] rounded-[0.8rem] top-[4rem] text-white shadow-lg overflow-hidden">
      {/* Profile row -> open Settings */}
      <li
        onClick={goSettings}
        className="flex items-center gap-[2rem] w-full hover:bg-zinc-700 duration-100 cursor-pointer py-[1rem] pl-[1rem]"
      >
        <img
          src={avatar}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = AVATAR_FALLBACK;
          }}
          alt="user"
          className="w-[2.8rem] h-[2.8rem] rounded-full object-cover"
        />
        <span className="text-[1.3rem] font-medium">{displayName}</span>
      </li>

      {/* Contacts (optional) */}
      <li
        onClick={goContacts}
        className="flex items-center gap-[2rem] w-full hover:bg-zinc-700 duration-100 cursor-pointer py-[1rem] pl-[1rem]"
      >
        <Icon icon="hugeicons:user" width="24" height="24" />
        <span className="text-[1.2rem] font-medium">Contacts</span>
      </li>

      {/* Settings */}
      <li
        onClick={goSettings}
        className="flex items-center gap-[2rem] w-full hover:bg-zinc-700 duration-100 cursor-pointer py-[1rem] pl-[1rem]"
      >
        <Icon icon="material-symbols-light:settings-outline" width="24" height="24" />
        <span className="text-[1.2rem] font-medium">Settings</span>
      </li>
    </ul>
  );
}
