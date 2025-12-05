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
  useSelectedChat,
  useChatsStore,
} from "../../../store/chats";
import { usePeerStore } from "../../../store/peer";
import { useContactsStore } from "../../../store/contacts";

const initialsAvatar = (seed: string) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed || "User")}`;

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

  const chatId = useSelectedChatId();
  const selectedChat = useSelectedChat();
  const peerId = useSelectedPeerId();
  const peerUsername = useSelectedPeerUsername();

  // name/avatar providers from chats store
  const displayNameFor = useChatsStore((s) => s.displayNameFor);
  const avatarFor = useChatsStore((s) => s.avatarFor);

  // subscribe so we refresh when contacts/peers land
  const contactsItems = useContactsStore((s) => s.items);
  const peersById = usePeerStore((s) => s.byId);

  // peer profile (for last-seen)
  const peerUser = usePeerStore((s) => (peerId ? s.byId[peerId] : undefined));
  useEffect(() => {
    if (peerId) {
      usePeerStore.getState().ensure(peerId).catch(() => {});
    }
  }, [peerId]);

  const displayName = useMemo(() => {
    if (selectedChat) return displayNameFor(selectedChat);
    const full = `${peerUser?.firstName ?? ""} ${peerUser?.lastName ?? ""}`.trim();
    return full || (peerUsername ?? "");
  }, [selectedChat, displayNameFor, peerUser, peerUsername, contactsItems, peersById]);

  const avatarSrc = useMemo(() => {
    if (selectedChat) return avatarFor(selectedChat);
    return peerUser?.profilePictureUrl || initialsAvatar(displayName || peerUsername || "User");
  }, [selectedChat, avatarFor, peerUser, displayName, peerUsername, contactsItems, peersById]);

  const subtitle = formatLastSeen(peerUser?.lastLoginAt as string | undefined);

  // back button for md- only
  const handleBack = () => {
    // deselect chat (your layout will show the list again on mobile)
    useChatsStore.getState().select(null);
    navigate("/", { replace: true });
  };

  return (
    <div className="relative">
      <header className="h-[5.6rem] px-[1.6rem] bg-zinc-900 border-b border-zinc-800 flex items-center gap-[1.2rem]">
        {/* Back on mobile */}
        {chatId && (
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

      {isSearching && <ChatSearchPanel setQuery={setQuery} query={query} onCloseSearch={closeSearch}/>}
      {openMenu && <ChatHeaderMenu onClose={() => setOpenMenu(false)} />}
      <ChatDatePickerModal
        open={openCalendar}
        onCancel={() => setOpenCalendar(false)}
        onJump={() => setOpenCalendar(false)}
      />
    </div>
  );
}
