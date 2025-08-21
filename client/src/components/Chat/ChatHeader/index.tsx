import ChatHeaderMenu from "../ChatHeaderMenu";          
import ChatSearchPanel from "../ChatSearchPanel";         
import ChatDatePickerModal from "../ChatDatePickerModal"; 

import { AvatarButton } from "./components/AvatarButton";
import { TitleArea } from "./components/TitleArea";
import { SearchField } from "./components/SearchField";
import { HeaderActions } from "./components/HeaderActions";
import { useChatHeader } from "./hooks/useChatHeader";
import type { Props } from "./types";

export default function ChatHeader({ onOpenProfile }: Props) {
  const {
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
  } = useChatHeader();

  return (
    <div className="relative">
      <header className="h-[5.6rem] px-[1.6rem] bg-zinc-900 border-b border-zinc-800 flex items-center gap-[1.2rem]">
        <AvatarButton onClick={onOpenProfile} />

        {isSearching ? (
          <SearchField value={query} onChange={setQuery} onClear={closeSearch} />
        ) : (
          <TitleArea />
        )}

        <HeaderActions
          isSearching={isSearching}
          onSearchClick={openSearch}
          onToggleMenu={() => setOpenMenu((v) => !v)}
          menuBtnRef={menuBtnRef}
          onOpenCalendar={() => setOpenCalendar(true)}
        />
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
