import { Icon } from "@iconify/react";
import { useReply } from "../../../store/useReply";
import { useMessageRegistry } from "../../../store/useMessageRegistry";

export default function ReplyBanner() {
  const { target, clear } = useReply();
  const { scrollTo } = useMessageRegistry();

  if (!target) return null;

  const preview =
    target.kind === "text"
      ? target.text
      : target.kind === "file"
      ? target.filename
      : target.label;

  return (
    <div
      className="mb-[0.6rem] flex items-center justify-between rounded-[0.9rem]
                 bg-green-900/35 border-l-[0.3rem] border-green-500 px-[1.0rem] py-[0.6rem]"
    >
      <button
        onClick={() => scrollTo(target.id)}
        className="flex items-center gap-[0.8rem] text-left"
      >
        <Icon icon="solar:reply-line-duotone" className="w-[1.6rem] h-[1.6rem] text-green-400" />
        <div>
          <div className="text-green-300 text-[1.3rem] leading-none">
            Reply to {target.author}
          </div>
          <div className="text-[1.25rem] text-green-200/90 truncate max-w-[28rem]">
            {preview}
          </div>
        </div>
      </button>

      <button
        onClick={clear}
        className="p-[0.4rem] rounded-full hover:bg-green-800/40"
        aria-label="Cancel reply"
      >
        <Icon icon="ph:x-bold" className="w-[1.6rem] h-[1.6rem] text-green-200" />
      </button>
    </div>
  );
}
