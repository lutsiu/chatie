import { useEffect, useMemo, useRef, useCallback } from "react";
import DateSeparator from "./DateSeparator";
import MessageBubble from "./MessageBubble";

import { useSelectedChatId } from "../../store/chats";
import { useAuthStore } from "../../store/auth";
import { useMessagesStore } from "../../store/messages";
import type { Message } from "../../api/messages";
import type { ReplyTarget } from "../../store/useReply";

/* ---------- helpers ---------- */

function hhmm(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}

function dayLabel(d: Date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (sameDay(d, today)) return "Today";
  if (sameDay(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
}

function isVideoMime(m?: string | null) {
  return !!m && m.startsWith("video");
}
function isImageMime(m?: string | null) {
  return !!m && m.startsWith("image");
}

/* ---------- component ---------- */

export default function MessageList() {
  const chatId = useSelectedChatId();
  const meId = useAuthStore((s) => s.user?.id ?? null);

  const ensureFirstPage = useMessagesStore((s) => s.ensureFirstPage);
  const loadMore        = useMessagesStore((s) => s.loadMore);

  // bucket selectors (keep each selector focused to avoid rerenders)
  const items       = useMessagesStore((s) => (chatId ? s.byChat[chatId]?.items : undefined)) ?? [];
  const loadingMore = useMessagesStore((s) => (chatId ? s.byChat[chatId]?.loadingMore : false)) ?? false;
  const loadingFirst= useMessagesStore((s) => (chatId ? s.byChat[chatId]?.loadingFirst : false)) ?? false;
  const topReached  = useMessagesStore((s) => (chatId ? s.byChat[chatId]?.topReached : false)) ?? false;

  // fetch first page when chat changes
  useEffect(() => {
    if (chatId) ensureFirstPage(chatId);
  }, [chatId, ensureFirstPage]);

  // scroll handling
  const scrollerRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true); // track if user is near bottom

  // After new messages arrive (or initial load), stick to bottom if user was there
  useEffect(() => {
    if (!scrollerRef.current) return;
    const el = scrollerRef.current;
    if (loadingMore) return; // don't jump during "load older"

    if (atBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [items.length, loadingMore]);

  const onScroll = useCallback(async () => {
    const el = scrollerRef.current;
    if (!el || !chatId) return;

    const threshold = 64; // px
    // Top → load older
    if (!loadingMore && !topReached && el.scrollTop <= threshold) {
      const prevHeight = el.scrollHeight;
      await loadMore(chatId);
      // keep the viewport from jumping after prepend
      const diff = el.scrollHeight - prevHeight;
      el.scrollTop = el.scrollTop + diff;
    }

    // Track bottom stickiness
    const distanceFromBottom = el.scrollHeight - (el.scrollTop + el.clientHeight);
    atBottomRef.current = distanceFromBottom < 24;
  }, [chatId, loadMore, loadingMore, topReached]);

  /* Map store messages → UI groups by day with separators */
  const groups = useMemo(() => {
    type UiMsg = {
      key: string;
      dateLabel?: string; // only for separators
      bubble?: React.ReactNode;
    };
    const out: UiMsg[] = [];
    let lastLabel: string | null = null;

    const toReply = (m: Message): ReplyTarget | undefined => {
      if (m.replyToId == null) return undefined;
      // We only have replyToPreview in the payload; author name can be improved later
      return {
        id: m.replyToId,
        author: "Reply", // could be peer/me with more data later
        kind: "text",
        text: m.replyToPreview ?? "",
      };
    };

    items.forEach((m) => {
      // date separator
      const created = new Date(m.createdAt);
      const label = dayLabel(created);
      if (label !== lastLabel) {
        out.push({ key: `sep-${label}-${created.getTime()}`, dateLabel: label });
        lastLabel = label;
      }

      const isOwn = meId != null && m.senderId === meId;

      // status (basic): optimistic → "sent", else undefined
      const status = (m as any)._localStatus === "sending" ? ("sent" as const) : undefined;

      // map attachments → media/file for your bubble
      let media: { url: string; type: "image" | "video" }[] | undefined;
      let file:
        | { url: string; name: string; size: number; mime?: string }
        | undefined;

      if (m.type === "IMAGE" || m.type === "VIDEO") {
        media =
          m.attachments.map((a) => {
            const t =
              m.type === "VIDEO"
                ? "video"
                : m.type === "IMAGE"
                ? "image"
                : isVideoMime(a.mime)
                ? "video"
                : "image";
            return { url: a.url, type: t };
          }) ?? [];
      } else if (m.type === "FILE") {
        const a = m.attachments[0];
        if (a) {
          file = {
            url: a.url,
            name: a.originalName || "file",
            size: a.sizeBytes ?? 0,
            mime: a.mime ?? undefined,
          };
        }
      }

      // deleted message placeholder
      const text =
        m.deletedAt != null
          ? "Message deleted"
          : m.content ?? undefined;

      out.push({
        key: `msg-${m.id}`,
        bubble: (
          <MessageBubble
            id={m.id}
            author={isOwn ? "You" : m.senderUsername}
            text={text}
            time={hhmm(m.createdAt)}
            isOwn={isOwn}
            status={status}
            media={media}
            file={file}
            reply={toReply(m)}
          />
        ),
      });
    });

    return out;
  }, [items, meId]);

  if (!chatId) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 text-zinc-400">Select a chat to see messages.</div>
      </div>
    );
  }

  return (
    <div
      ref={scrollerRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto"
    >
      <div className="py-[1.6rem] space-y-[0.8rem]">
        {loadingFirst && !items.length ? (
          <div className="px-[1.6rem] text-zinc-400">Loading…</div>
        ) : null}

        {groups.map((g) =>
          g.dateLabel ? (
            <DateSeparator key={g.key} label={g.dateLabel} />
          ) : (
            <div key={g.key}>{g.bubble}</div>
          )
        )}
      </div>
    </div>
  );
}
