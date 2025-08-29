type Media = { url: string; type: "image" | "video" };

type Props = {
  items: Media[];
  onOpen: (startIndex: number) => void;
};

/** Clickable media mosaic (1–4+, with +N badge on the last tile if more than 4) */
export default function MediaMosaic({ items, onOpen }: Props) {
  const WRAP =
    // take full width on small screens, progressively cap on larger screens
    "w-full md:max-w-[40rem] lg:max-w-[52rem] xl:max-w-[64rem]";

  const count = items.length;

  const Tile = ({
    i,
    className = "",
    showOverlay = false,
    overlayText,
  }: {
    i: number;
    className?: string;
    showOverlay?: boolean;
    overlayText?: string;
  }) => {
    const m = items[i];
    return (
      <button
        onClick={() => onOpen(i)}
        className={`relative w-full h-full overflow-hidden rounded-[0.8rem] bg-black/20 ${className}`}
      >
        {m.type === "image" ? (
          <img src={m.url} alt="" className="w-full h-full object-cover" />
        ) : (
          <video src={m.url} className="w-full h-full object-cover" />
        )}
        {showOverlay && (
          <div className="absolute inset-0 bg-black/50 grid place-items-center">
            <span className="text-white text-[1.6rem] font-semibold">{overlayText}</span>
          </div>
        )}
      </button>
    );
  };

  if (count === 1) {
    return (
      <div className={WRAP}>
        <Tile i={0} className="aspect-video" />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className={`grid grid-cols-2 gap-[0.6rem] ${WRAP}`}>
        <Tile i={0} className="aspect-square" />
        <Tile i={1} className="aspect-square" />
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className={`grid grid-cols-2 gap-[0.6rem] ${WRAP}`}>
        <Tile i={0} className="row-span-2 aspect-[2/3]" />
        <Tile i={1} className="aspect-square" />
        <Tile i={2} className="aspect-square" />
      </div>
    );
  }

  // 4 or more → 2x2, last tile shows +N if there are extras
  return (
    <div className={`grid grid-cols-2 gap-[0.6rem] ${WRAP}`}>
      <Tile i={0} className="aspect-square" />
      <Tile i={1} className="aspect-square" />
      <Tile i={2} className="aspect-square" />
      <Tile
        i={3}
        className="aspect-square"
        showOverlay={items.length > 4}
        overlayText={items.length > 4 ? `+${items.length - 4}` : undefined}
      />
    </div>
  );
}
