import { useEffect, useMemo, useState } from "react";

import MessageList from "./MessageList";
import Composer from "./Composer";
import PinnedBanner from "./PinnedBanner";
import ChatHeader from "./ChatHeader";
import UserInfoPanel from "./UserInfoPanel";

import {
  useSelectedPeerId,
  useSelectedPeerUsername,
  useSelectedChatId,
} from "../../store/chats";
import { usePeerStore } from "../../store/peer";
import { useMessagesStore } from "../../store/messages";
import type { Message } from "../../api/messages";

const initialsAvatar = (seed: string) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed || "User")}`;

const isImage = (mime?: string | null) => !!mime && mime.startsWith("image");
const formatBytes = (n?: number | null) => {
  const b = n ?? 0;
  if (b < 1024) return `${b} B`;
  const kb = b / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
};

// --- NEW: simple formatter for last seen ---
function formatLastSeen(iso?: string | null) {
  if (!iso) return "last seen recently";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "last seen recently";

  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const y = new Date(now);
  y.setDate(now.getDate() - 1);

  if (sameDay) return `last seen today at ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  if (d.toDateString() === y.toDateString()) {
    return `last seen yesterday at ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }
  return `last seen ${d.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" })}`;
}

export default function ChatWindow() {
  const [profileOpen, setProfileOpen] = useState(false);

  // stable primitives
  const chatId = useSelectedChatId();
  const peerId = useSelectedPeerId();
  const peerUsername = useSelectedPeerUsername() ?? "";

  // cached peer profile
  const peerUser = usePeerStore((s) => (peerId ? s.byId[peerId] : undefined));

  // ensure peer profile when id changes
  useEffect(() => {
    if (peerId) usePeerStore.getState().ensure(peerId).catch(() => {});
  }, [peerId]);

  // ---- derive media/files for the side panel via subscription ----
  const [panelMedia, setPanelMedia] = useState<{ id: number; url: string }[]>([]);
  const [panelFiles, setPanelFiles] = useState<{ id: number; name: string; size: string }[]>([]);

  useEffect(() => {
    setPanelMedia([]);
    setPanelFiles([]);

    if (!chatId) return;

    const computeFrom = (items?: Message[]) => {
      const list = items ?? [];
      const media: { id: number; url: string }[] = [];
      const files: { id: number; name: string; size: string }[] = [];

      for (const m of list) {
        if ((m as any)?.deletedAt) continue;

        for (const a of m.attachments ?? []) {
          if (!a?.url) continue;

          // put only images into Media; everything else goes to Files
          if (isImage(a.mime) || m.type === "IMAGE") {
            media.push({ id: a.id, url: a.url });
          } else {
            const name =
              a.originalName ||
              (() => {
                try {
                  const last = a.url.split("/").pop();
                  return last ? decodeURIComponent(last) : "file";
                } catch {
                  return "file";
                }
              })();
            files.push({ id: a.id, name, size: formatBytes(a.sizeBytes) });
          }
        }
      }

      media.reverse();
      files.reverse();

      setPanelMedia(media);
      setPanelFiles(files);
    };

    // seed with current bucket
    computeFrom(useMessagesStore.getState().byChat[chatId]?.items as Message[] | undefined);

    // recompute on ANY store update (handles in-place mutations like push/unshift)
    const unsub = useMessagesStore.subscribe((state) => {
      computeFrom(state.byChat[chatId!]?.items as Message[] | undefined);
    });

    return () => unsub();
  }, [chatId]);

  // --- NEW: build status with lastLoginAt if present ---
  const statusLabel = useMemo(
    () => formatLastSeen((peerUser as any)?.lastLoginAt as string | undefined),
    [peerUser]
  );

  // build panel user data
  const panelUser = useMemo(() => {
    if (!peerId) return null;
    const fullName = `${peerUser?.firstName ?? ""} ${peerUser?.lastName ?? ""}`.trim();
    const displayName = fullName || peerUsername;
    const avatar = peerUser?.profilePictureUrl || initialsAvatar(displayName || peerUsername);

    return {
      name: displayName,
      username: peerUsername,
      status: statusLabel || "last seen recently", // fallback if anything goes wrong
      avatar,
      media: panelMedia,
      files: panelFiles,
    };
  }, [peerId, peerUser, peerUsername, panelMedia, panelFiles, statusLabel]);

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
