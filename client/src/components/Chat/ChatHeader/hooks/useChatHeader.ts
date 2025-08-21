import { useEffect, useRef, useState } from "react";

export function useChatHeader() {
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

  return {
    isSearching,
    query,
    setQuery,
    openMenu,
    setOpenMenu,
    openCalendar,
    setOpenCalendar,
    menuBtnRef,
    openSearch,
    closeSearch,
  };
}
