type Media = { id: number; url: string };

export default function MediaGrid({
  items,
  onOpen,
}: {
  items: Media[];
  onOpen: (idx: number) => void;
}) {
  return (
    <div className="mt-[1.6rem] grid grid-cols-3 gap-[0.6rem]">
      {items.map((m, idx) => (
        <img
          key={m.id}
          src={m.url}
          alt=""
          className="w-full h-[7rem] object-cover rounded-[0.6rem] cursor-zoom-in"
          onClick={() => onOpen(idx)}
        />
      ))}
    </div>
  );
}
