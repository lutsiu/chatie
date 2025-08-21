import type { ReplyTarget } from "../../../../store/useReply";

type Props = {
  reply: ReplyTarget;
  isOwn: boolean;
  onJump: () => void;
};

export default function ReplyPreview({ reply, isOwn, onJump }: Props) {
  return (
    <button
      onClick={onJump}
      className={`w-full text-left mb-[0.6rem] rounded-[0.8rem] px-[0.8rem] py-[0.6rem] flex items-start gap-[0.8rem]
                  border-l-[0.25rem] ${isOwn ? "border-green-300 bg-black/10" : "border-green-500 bg-white/5"}`}
    >
      {"thumb" in reply && reply.thumb ? (
        <img
          src={reply.thumb}
          alt=""
          className="w-[3.2rem] h-[3.2rem] rounded-[0.4rem] object-cover shrink-0"
        />
      ) : null}
      <div className="min-w-0">
        <div className="text-white font-semibold text-[1.25rem] truncate">{reply.author}</div>
        <div className="text-[1.25rem] opacity-90 truncate">
          {reply.kind === "text"
            ? reply.text
            : reply.kind === "file"
            ? reply.filename
            : reply.label}
        </div>
      </div>
    </button>
  );
}
