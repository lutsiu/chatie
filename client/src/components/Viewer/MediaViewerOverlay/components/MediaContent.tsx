type Item = {
  url: string;
  type: "image" | "video";
  filename?: string;
};

export default function MediaContent({ item }: { item: Item }) {
  const common =
    "block w-auto h-auto object-contain rounded-[0.8rem] shadow-2xl " +
    "min-w-[40rem] min-h-[28rem] sm:min-w-[55vw] sm:min-h-[45vh] " +
    "max-w-[min(96vw,1400px)] max-h-[min(92vh,90rem)]";

  return (
    <div>
      {item.type === "image" ? (
        <img src={item.url} alt="" className={common} />
      ) : (
        <video src={item.url} controls autoPlay className={common} />
      )}
    </div>
  );
}
