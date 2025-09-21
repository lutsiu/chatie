import { Icon } from "@iconify/react";
import type { Ref } from "react";

type Props = {
  isSearching: boolean;
  onSearchClick: () => void;
  onToggleMenu: () => void;
  menuBtnRef: Ref<HTMLButtonElement>;  
  onOpenCalendar: () => void;
};

export function HeaderActions({
  isSearching,
  onSearchClick,
  onToggleMenu,
  menuBtnRef,
  onOpenCalendar,
}: Props) {
  return (
    <div className="flex items-center gap-[1.2rem]">
      {!isSearching ? (
        <>
          <button
            onClick={onSearchClick}
            className="p-[0.6rem] rounded-full hover:bg-zinc-800"
            aria-label="Search in chat"
          >
            <Icon icon="material-symbols:search" className="w-[2rem] h-[2rem] text-zinc-300" />
          </button>
          <button
            ref={menuBtnRef}
            onClick={onToggleMenu}
            className="p-[0.6rem] rounded-full hover:bg-zinc-800"
            aria-label="Menu"
          >
            <Icon icon="solar:menu-dots-bold" className="w-[2rem] h-[2rem] text-zinc-300" />
          </button>
        </>
      ) : (
        <button
          onClick={onOpenCalendar}
          className="p-[0.6rem] rounded-full hover:bg-zinc-800"
          aria-label="Open calendar"
        >
          <Icon icon="solar:calendar-linear" className="w-[2rem] h-[2rem] text-zinc-300" />
        </button>
      )}
    </div>
  );
}
