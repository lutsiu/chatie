// src/components/Chat/Header/index.tsx
import { useEffect, useMemo } from "react";
import ChatHeaderMenu from "../ChatHeaderMenu";
import ChatDatePickerModal from "../ChatDatePickerModal";
import { AvatarButton } from "./components/AvatarButton";
import { TitleArea } from "./components/TitleArea";
import { SearchField } from "./components/SearchField";
import { HeaderActions } from "./components/HeaderActions";
import { useChatHeader } from "./hooks/useChatHeader";
import ChatSearchPanel from "../ChatSearchPanel";
import type { Props } from "./types";

import {
  useSelectedPeerId,
  useSelectedPeerUsername,
} from "../../../store/chats";
import { usePeerStore } from "../../../store/peer";

const initialsAvatar = (seed: string) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed || "User")}`;

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

  const peerId = useSelectedPeerId();               // primitive
  const peerUsername = useSelectedPeerUsername();   // primitive

  // read the peer's full profile (may be undefined initially)
  const peerUser = usePeerStore((s) => (peerId ? s.byId[peerId] : undefined));

  // fetch peer profile exactly once per chat id
  useEffect(() => {
    if (peerId) {
      usePeerStore.getState().ensure(peerId).catch(() => {});
    }
  }, [peerId]);

  const displayName = useMemo(() => {
    if (!peerId) return "";
    const full = `${peerUser?.firstName ?? ""} ${peerUser?.lastName ?? ""}`.trim();
    return full || (peerUsername ?? "");
  }, [peerId, peerUser, peerUsername]);

  const avatarSrc = useMemo(() => {
    if (!peerId) return initialsAvatar("User");
    return peerUser?.profilePictureUrl || initialsAvatar(displayName || peerUsername || "User");
  }, [peerId, peerUser, displayName, peerUsername]);

  const subtitle = "last seen recently"; // later: compute from lastSeenAt

  return (
    <div className="relative">
      <header className="h-[5.6rem] px-[1.6rem] bg-zinc-900 border-b border-zinc-800 flex items-center gap-[1.2rem]">
        <AvatarButton onClick={onOpenProfile} src={avatarSrc} alt={displayName} />

        {isSearching ? (
          <SearchField value={query} onChange={setQuery} onClear={closeSearch} />
        ) : (
          <TitleArea title={displayName} subtitle={subtitle} />
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
