// components/Chat/UserInfoPanel.tsx
import { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { useMediaViewer } from "../../store/useMediaViewer"; 

type Media = { id: number; url: string };
type FileItem = { id: number; name: string; size: string };

type Props = {
  open: boolean;
  onClose: () => void;
  user: {
    name: string;
    username: string;
    status: string;
    avatar: string;
    media: Media[];
    files: FileItem[];
  };
};

export default function UserInfoPanel({ open, onClose, user }: Props) {
  const [tab, setTab] = useState<"media" | "files">("media");
  const openViewer = useMediaViewer(s => s.open);

  const mediaItems = useMemo(
    () => user.media.map((m) => ({ id: m.id, url: m.url, type: "image" as const })),
    [user.media]
  );

  const handleOpenAt = (idx: number) => {
    if (!mediaItems.length) return;
    openViewer(mediaItems, idx);
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        className={`absolute right-0 top-0 h-full bg-zinc-900 border-l border-zinc-800
        w-[28rem] md:w-[30rem] lg:w-[25vw] min-w-[26rem] max-w-[38rem]
        transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-[1.6rem] h-[5.6rem] border-b border-zinc-800">
          <div className="text-white text-[1.6rem] font-semibold">User Info</div>
          <button onClick={onClose} className="p-[0.6rem] rounded-full hover:bg-zinc-800">
            <Icon icon="ph:x-bold" className="w-[2rem] h-[2rem] text-zinc-300" />
          </button>
        </div>

        <div className="p-[1.6rem]">
          <div className="flex flex-col items-center">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-[12rem] h-[12rem] rounded-full object-cover cursor-zoom-in"
              onClick={() => openViewer([{ id: "avatar", url: user.avatar, type: "image" }], 0)}
            />
            <div className="mt-[1rem] text-white text-[1.8rem] font-semibold">{user.name}</div>
            <div className="text-zinc-400 text-[1.2rem]">{user.status}</div>
          </div>

          <div className="mt-[2rem] space-y-[1.2rem]">
            <div className="flex items-center gap-[1rem]">
              <Icon icon="mdi:at" className="w-[2rem] h-[2rem] text-zinc-400" />
              <div>
                <div className="text-white">{user.username}</div>
                <div className="text-[1.2rem] text-zinc-400">Username</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[1rem]">
                <Icon icon="mdi:bell-outline" className="w-[2rem] h-[2rem] text-zinc-400" />
                <div className="text-white">Notifications</div>
              </div>
              <Toggle />
            </div>
          </div>

          <div className="mt-[2rem] border-b border-zinc-800 flex gap-[2rem]">
            <button
              onClick={() => setTab("media")}
              className={`pb-[0.8rem] text-[1.4rem] ${
                tab === "media" ? "text-purple-400 border-b-2 border-purple-500" : "text-zinc-400"
              }`}
            >
              Media
            </button>
            <button
              onClick={() => setTab("files")}
              className={`pb-[0.8rem] text-[1.4rem] ${
                tab === "files" ? "text-purple-400 border-b-2 border-purple-500" : "text-zinc-400"
              }`}
            >
              Files
            </button>
          </div>

          {tab === "media" ? (
            <div className="mt-[1.6rem] grid grid-cols-3 gap-[0.6rem]">
              {user.media.map((m, idx) => (
                <img
                  key={m.id}
                  src={m.url}
                  alt=""
                  className="w-full h-[7rem] object-cover rounded-[0.6rem] cursor-zoom-in"
                  onClick={() => handleOpenAt(idx)}
                />
              ))}
            </div>
          ) : (
            <ul className="mt-[1.6rem] space-y-[1rem]">
              {user.files.map(f => (
                <li
                  key={f.id}
                  className="flex items-center justify-between bg-zinc-800/50 rounded-[0.6rem] px-[1rem] py-[0.8rem]"
                >
                  <div className="flex items-center gap-[0.8rem]">
                    <Icon icon="solar:document-linear" className="w-[2rem] h-[2rem] text-zinc-300" />
                    <span className="text-white">{f.name}</span>
                  </div>
                  <span className="text-[1.2rem] text-zinc-400">{f.size}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}

function Toggle() {
  const [on, setOn] = useState(true);
  return (
    <button
      onClick={() => setOn(v => !v)}
      className={`w-[4.8rem] h-[2.6rem] rounded-full transition-colors ${
        on ? "bg-purple-500/80" : "bg-zinc-700"
      } relative`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-[0.2rem] left-[0.2rem] h-[2.2rem] w-[2.2rem] bg-white rounded-full transition-transform ${
          on ? "translate-x-[2.2rem]" : ""
        }`}
      />
    </button>
  );
}
