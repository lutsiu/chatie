import { Icon } from "@iconify/react";

type Props = {
  time: string;
  status?: "sent" | "delivered" | "read";
  isOwn: boolean;
};

export default function MetaBar({ time, status, isOwn }: Props) {
  return (
    <div className="flex items-center gap-[0.4rem] mt-[0.6rem] justify-end">
      <span className="text-[1.1rem] opacity-80">{time}</span>
      {isOwn && (
        <span className="text-[1.3rem]">
          {status === "read" && <Icon icon="solar:double-check-linear" />}
          {status === "delivered" && <Icon icon="solar:check-read-line-duotone" />}
          {status === "sent" && <Icon icon="solar:check-line-duotone" />}
        </span>
      )}
    </div>
  );
}
