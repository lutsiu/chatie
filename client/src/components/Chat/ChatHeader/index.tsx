// src/components/Chat/ChatHeader/index.tsx
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

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
  useSelectedChatId,
  // ⬇️ if your store exposes the root hook for actions, import it too:
  useChatsStore,
} from "../../../store/chats";
import { usePeerStore } from "../../../store/peer";

const initialsAvatar = (seed: string) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed || "User")}`;

// Small formatter for "last seen ..."
function formatLastSeen(iso?: string | null) {
  if (!iso) return "last seen recently";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "last seen recently";

  const now = new Date();
  const isSameDay = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay) {
    const t = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `last seen today at ${t}`;
  }
  if (d.toDateString() === yesterday.toDateString()) {
    const t = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `last seen yesterday at ${t}`;
  }
  const date = d.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
  return `last seen ${date}`;
}

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

  const navigate = useNavigate();

  const chatId = useSelectedChatId();              // primitive
  const peerId = useSelectedPeerId();              // primitive
  const peerUsername = useSelectedPeerUsername();  // primitive

  // get the action that selects/deselects a chat (expects number | null)
  const selectChat = useChatsStore((s) => s.select);

  // peer profile (may be undefined until fetched)
  const peerUser = usePeerStore((s) => (peerId ? s.byId[peerId] : undefined));

  // fetch peer profile once per chat id
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

  // compute subtitle with lastLoginAt if present; fallback otherwise
  const subtitle = formatLastSeen(peerUser?.lastLoginAt as string | undefined);

  // show back button on mobile only when a chat is selected
  const showBack = !!chatId;

  const handleBack = () => {
    // clear current selection (triggers your mobile layout to show the main list)
    try {
      selectChat?.(null as unknown as number); // if your action is typed (number | null), remove the assertion
    } catch {
      // ignore
    }
    // and navigate home as a route fallback (no-op if you rely purely on store selection)
    navigate("/", { replace: true });
  };

  return (
    <div className="relative">
      <header className="h-[5.6rem] px-[1.6rem] bg-zinc-900 border-b border-zinc-800 flex items-center gap-[1.2rem]">
        {/* Back arrow — only visible on md- (mobile) */}
        {showBack && (
          <button
            onClick={handleBack}
            className="md:hidden p-[0.6rem] rounded-full hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Back"
          >
            <Icon icon="ph:arrow-left" className="w-[2.2rem] h-[2.2rem] text-zinc-200" />
          </button>
        )}

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

      {isSearching && <ChatSearchPanel setQuery={setQuery} query={query} />}
      {openMenu && <ChatHeaderMenu onClose={() => setOpenMenu(false)} />}
      <ChatDatePickerModal
        open={openCalendar}
        onCancel={() => setOpenCalendar(false)}
        onJump={() => setOpenCalendar(false)}
      />
    </div>
  );
}
