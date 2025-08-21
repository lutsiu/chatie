import { useState } from "react";

export function useContextMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  const handleContext = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new Event("close-all-context-menus"));
    setMenuPos({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
  };

  const closeMenu = () => setMenuOpen(false);

  return { menuOpen, menuPos, handleContext, closeMenu };
}
