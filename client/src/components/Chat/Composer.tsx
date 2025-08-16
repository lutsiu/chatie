// src/components/Chat/Composer/index.tsx (or Composer.tsx)
import { Icon } from "@iconify/react";
import { useState } from "react";
import AttachmentMenu from "./Composer/AttachmentMenu";
import AttachmentOverlay from "./Composer/AttachmentOverlay";

export default function Composer() {
  const [value, setValue] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="px-[1.6rem] py-[1.2rem] bg-zinc-900 border-t border-zinc-800 relative">
      <div className="flex items-center gap-[1.2rem]">
        <div className="flex-1 bg-zinc-800 rounded-[1.2rem] px-[1.6rem] py-[0.9rem] flex items-center gap-[1rem]">
          <Icon icon="solar:emoji-funny-square-linear" className="w-[2rem] h-[2rem] text-zinc-300" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Message"
            className="flex-1 bg-transparent outline-none text-white text-[1.45rem] placeholder:text-zinc-400"
          />
          <button
            className="relative p-[0.6rem] rounded-full hover:bg-zinc-700"
            onClick={() => setShowMenu((v) => !v)}
            aria-label="Attach"
          >
            <Icon icon="solar:paperclip-linear" className="w-[2rem] h-[2rem] text-zinc-300" />
            {showMenu && <AttachmentMenu onClose={() => setShowMenu(false)} />}
          </button>
        </div>

        <button
          disabled={!value.trim()}
          className={`w-[3.8rem] h-[3.8rem] rounded-full grid place-items-center 
            ${value.trim() ? "bg-purple-600 hover:bg-purple-500" : "bg-zinc-700 cursor-not-allowed"}`}
          onClick={() => setValue("")}
          aria-label="Send"
        >
          <Icon icon="fe:paper-plane" className="w-[2.1rem] h-[2.1rem] text-white" />
        </button>
      </div>

      {/* Decides which modal to show, based on the store */}
      <AttachmentOverlay />
    </div>
  );
}