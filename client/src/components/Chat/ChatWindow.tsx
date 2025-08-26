import { useEffect, useMemo, useState } from "react";

import MessageList from "./MessageList";
import Composer from "./Composer";
import PinnedBanner from "./PinnedBanner";
import ChatHeader from "./ChatHeader";
import UserInfoPanel from "./UserInfoPanel";

import {
  useSelectedPeerId,
  useSelectedPeerUsername,
} from "../../store/chats";            // <-- primitive selectors
import { usePeerStore } from "../../store/peer";

const initialsAvatar = (seed: string) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed || "User")}`;

export default function ChatWindow() {
  const [profileOpen, setProfileOpen] = useState(false);

  // primitive (stable) values from the chats store
  const peerId = useSelectedPeerId();                 // number | null
  const peerUsername = useSelectedPeerUsername() ?? ""; // string

  // cached peer profile (if fetched)
  const peerUser = usePeerStore((s) => (peerId ? s.byId[peerId] : undefined));

  // fetch peer profile only when the numeric id changes
  useEffect(() => {
    if (peerId) {
      usePeerStore.getState().ensure(peerId).catch(() => {});
    }
  }, [peerId]);

  // build panel data from primitive pieces (memoized)
  const panelUser = useMemo(() => {
    if (!peerId) return null;
    const fullName = `${peerUser?.firstName ?? ""} ${peerUser?.lastName ?? ""}`.trim();
    const displayName = fullName || peerUsername;
    const avatar = peerUser?.profilePictureUrl || initialsAvatar(displayName || peerUsername);

    return {
      name: displayName,
      username: peerUsername,
      status: "last seen recently", // replace when you expose lastSeenAt
      avatar,
      media: [] as { id: number; url: string }[],               // placeholder for future media
      files: [] as { id: number; name: string; size: string }[],// placeholder for future files
    };
  }, [peerId, peerUser, peerUsername]);

  return (
    <section className="relative h-full w-full flex flex-col bg-zinc-950">
      <ChatHeader onOpenProfile={() => setProfileOpen(true)} />
      <PinnedBanner />
      <MessageList />
      <Composer />

      {panelUser && (
        <UserInfoPanel
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          user={panelUser}
        />
      )}
    </section>
  );
}
