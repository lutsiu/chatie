import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import ChatHeaderMenu from "./ChatHeaderMenu";
import ChatSearchPanel from "./ChatSearchPanel";
import ChatDatePickerModal from "./ChatDatePickerModal";

type Props = {
  onOpenProfile: () => void;
};

export default function ChatHeader({ onOpenProfile }: Props) {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const openSearch = () => {
    setOpenMenu(false);
    setIsSearching(true);
  };
  const closeSearch = () => {
    setQuery("");
    setIsSearching(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (isSearching) closeSearch();
      if (openMenu) setOpenMenu(false);
      if (openCalendar) setOpenCalendar(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSearching, openMenu, openCalendar]);

  return (
    <div className="relative">
      <header className="h-[5.6rem] px-[1.6rem] bg-zinc-900 border-b border-zinc-800 flex items-center gap-[1.2rem]">
        <button onClick={onOpenProfile} className="shrink-0">
          <img
            src="https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=200&auto=format&fit=crop"
            alt="Avatar"
            className="w-[3.6rem] h-[3.6rem] rounded-full object-cover"
          />
        </button>

        {isSearching ? (
          <div className="relative flex-1 min-w-0">
            <Icon
              icon="ph:magnifying-glass-thin"
              className="absolute left-[1.2rem] top-1/2 -translate-y-1/2 w-[1.8rem] h-[1.8rem] text-gray-300"
            />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-zinc-800 text-white rounded-full h-[3.6rem] pl-[3.8rem] pr-[4.2rem] text-[1.4rem] outline-none border border-gray-700 focus:border-purple-500"
            />
            <button
              onClick={closeSearch}
              className="absolute right-[0.8rem] top-1/2 -translate-y-1/2 p-[0.4rem] rounded-full hover:bg-zinc-700"
              aria-label="Clear search"
            >
              <Icon icon="ph:x-bold" className="w-[1.6rem] h-[1.6rem] text-gray-300" />
            </button>
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <div className="text-white text-[1.6rem] font-semibold truncate">Valery</div>
            <div className="text-zinc-400 text-[1.2rem] truncate">last seen recently</div>
          </div>
        )}

        <div className="flex items-center gap-[1.2rem]">
          {!isSearching ? (
            <>
              <button
                onClick={openSearch}
                className="p-[0.6rem] rounded-full hover:bg-zinc-800"
                aria-label="Search in chat"
              >
                <Icon icon="material-symbols:search" className="w-[2rem] h-[2rem] text-zinc-300" />
              </button>
              <button
                ref={menuBtnRef}
                onClick={() => setOpenMenu((v) => !v)}
                className="p-[0.6rem] rounded-full hover:bg-zinc-800"
                aria-label="Menu"
              >
                <Icon icon="solar:menu-dots-bold" className="w-[2rem] h-[2rem] text-zinc-300" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setOpenCalendar(true)}
              className="p-[0.6rem] rounded-full hover:bg-zinc-800"
              aria-label="Open calendar"
            >
              <Icon icon="solar:calendar-linear" className="w-[2rem] h-[2rem] text-zinc-300" />
            </button>
          )}
        </div>
      </header>

      {isSearching && <ChatSearchPanel query={query} />}
      {openMenu && <ChatHeaderMenu onClose={() => setOpenMenu(false)} />}
      <ChatDatePickerModal
        open={openCalendar}
        onCancel={() => setOpenCalendar(false)}
        onJump={() => setOpenCalendar(false)}
      />
    </div>
  );
}
