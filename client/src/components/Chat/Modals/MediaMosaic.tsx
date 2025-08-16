type Preview = { url: string; type: "image" | "video" };

type Props = {
  items: Preview[]; // 1..5
};

export default function MediaMosaic({ items }: Props) {
  const n = Math.max(0, Math.min(5, items.length));
  if (n === 0) return null;

  // common tile style
  const tile = "w-full h-full rounded-[0.8rem] object-cover";
  const tileContain = "w-full h-full rounded-[0.8rem] object-cover";

  if (n === 1) {
    const it = items[0];
    return (
      <div className="w-full h-[min(56vh,42rem)]">
        {it.type === "image" ? (
          <img src={it.url} alt="" className={`${tileContain} object-contain w-full h-full`} />
        ) : (
          <video src={it.url} controls className={`${tileContain} object-contain w-full h-full`} />
        )}
      </div>
    );
  }

  if (n === 2) {
    return (
      <div className="grid grid-cols-2 gap-[0.8rem] h-[min(56vh,36rem)]">
        {items.map((it, i) =>
          it.type === "image" ? (
            <img key={i} src={it.url} alt="" className={tile} />
          ) : (
            <video key={i} src={it.url} controls className={tile} />
          )
        )}
      </div>
    );
  }

  if (n === 3) {
    // big left (rows 1..2), two stacked on right
    return (
      <div className="grid grid-cols-3 grid-rows-2 gap-[0.8rem] h-[min(56vh,40rem)]">
        <div className="col-span-2 row-span-2">
          {items[0].type === "image" ? (
            <img src={items[0].url} alt="" className="w-full h-full rounded-[0.8rem] object-cover" />
          ) : (
            <video src={items[0].url} controls className="w-full h-full rounded-[0.8rem] object-cover" />
          )}
        </div>
        <div className="">
          {items[1].type === "image" ? (
            <img src={items[1].url} alt="" className="w-full h-full rounded-[0.8rem] object-cover" />
          ) : (
            <video src={items[1].url} controls className="w-full h-full rounded-[0.8rem] object-cover" />
          )}
        </div>
        <div className="">
          {items[2].type === "image" ? (
            <img src={items[2].url} alt="" className="w-full h-full rounded-[0.8rem] object-cover" />
          ) : (
            <video src={items[2].url} controls className="w-full h-full rounded-[0.8rem] object-cover" />
          )}
        </div>
      </div>
    );
  }

  if (n === 4) {
    // 2x2
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-[0.8rem] h-[min(56vh,40rem)]">
        {items.map((it, i) =>
          it.type === "image" ? (
            <img key={i} src={it.url} alt="" className={tile} />
          ) : (
            <video key={i} src={it.url} controls className={tile} />
          )
        )}
      </div>
    );
  }

  // n === 5  -> 2x2 + last spans all columns
  return (
    <div className="grid grid-cols-2 grid-rows-3 gap-[0.8rem] h-[min(56vh,44rem)]">
      {items.slice(0, 4).map((it, i) =>
        it.type === "image" ? (
          <img key={i} src={it.url} alt="" className={tile} />
        ) : (
          <video key={i} src={it.url} controls className={tile} />
        )
      )}
      <div className="col-span-2">
        {items[4].type === "image" ? (
          <img src={items[4].url} alt="" className="w-full h-full rounded-[0.8rem] object-cover" />
        ) : (
          <video src={items[4].url} controls className="w-full h-full rounded-[0.8rem] object-cover" />
        )}
      </div>
    </div>
  );
}
