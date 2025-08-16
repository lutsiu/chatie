import { Icon } from "@iconify/react";

type Props = {
  text?: string;
  time: string;
  isOwn?: boolean;
  status?: "sent" | "delivered" | "read";
};

export default function MessageBubble({ text, time, isOwn, status }: Props) {
  const base =
    "max-w-[70%] rounded-[1.2rem] px-[1.2rem] py-[0.8rem] text-[1.45rem] leading-[1.35] shadow-sm my-[1rem]";
  const colors = isOwn
    ? "bg-purple-600/90 text-white"
    : "bg-zinc-800 text-zinc-100";

  return (
    <div className={`w-full flex ${isOwn ? "justify-end" : "justify-start"} px-[1.6rem]`}>
      <div className={`${base} ${colors} relative`}>
        {text && <p className="whitespace-pre-wrap break-words">{text}</p>}

        <div className="flex items-center gap-[0.4rem] mt-[0.4rem] justify-end">
          <span className="text-[1.1rem] opacity-80">{time}</span>
          {isOwn && (
            <span className="text-[1.3rem]">
              {status === "read" && <Icon icon="solar:double-check-linear" />}
              {status === "delivered" && <Icon icon="solar:check-read-line-duotone" />}
              {status === "sent" && <Icon icon="solar:check-line-duotone" />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
