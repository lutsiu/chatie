import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import HamburgerMenu from './HamburgerMenu';

type Props = {
  isSearching: boolean;
  clearSearch: () => void;
  onOpenSettings: () => void;
  onOpenContacts: () => void;   // ← add
};

export default function Hamburger({
  isSearching,
  clearSearch,
  onOpenSettings,
  onOpenContacts,                // ← add
}: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleButtonClick = () => {
    if (!isSearching) setShowMenu(prev => !prev);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={isSearching ? clearSearch : handleButtonClick}
        className="w-[3.6rem] h-[3.6rem] flex items-center justify-center rounded-full hover:bg-zinc-800 cursor-pointer"
      >
        <Icon
          icon={isSearching ? 'solar:arrow-left-linear' : 'solar:hamburger-menu-linear'}
          className="w-[2.5rem] h-[2.5rem] text-white"
        />
      </button>

      {showMenu && (
        <HamburgerMenu
          onClose={() => setShowMenu(false)}
          onOpenSettings={() => { setShowMenu(false); onOpenSettings(); }}
          onOpenContacts={() => { setShowMenu(false); onOpenContacts(); }} // ← forward
        />
      )}
    </div>
  );
}
