type Props = {
  side: "left" | "right";
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
};

export default function NavZone({ side, onClick, ariaLabel, children }: Props) {
  const baseSide =
    side === "left"
      ? "left-0 group/left"
      : "right-0 group/right";

  const btnSide =
    side === "left"
      ? "left-[2rem] group-hover/left:opacity-100"
      : "right-[2rem] group-hover/right:opacity-100";

  return (
    <div className={`absolute inset-y-0 w-[20%] ${baseSide}`} onClick={onClick}>
      <button
        className={`absolute top-1/2 -translate-y-1/2 opacity-0 ${btnSide}
                    p-[0.8rem] rounded-full bg-black/40 hover:bg-black/60`}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    </div>
  );
}
