type Props = {
  name: string;
  avatar: string | null | undefined;
  subline: string; // email
};

export default function ContactListItem({ name, avatar, subline }: Props) {
  const fallback = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
    (name || subline || "User").trim()
  )}&fontWeight=700`;

  return (
    <li className="flex gap-[1.2rem] items-center px-[1.5rem] py-[1.1rem] hover:bg-zinc-800 cursor-pointer rounded-[1rem]">
      <img
        src={avatar || fallback}
        alt={name || subline}
        loading="lazy"
        onError={(e) => {
          // swap to fallback once; avoid infinite loop
          const img = e.currentTarget;
          if (img.src !== fallback) img.src = fallback;
        }}
        className="w-[4.5rem] h-[4.5rem] rounded-full object-cover"
      />
      <div className="flex flex-col border-b border-zinc-800 pb-[0.4rem]">
        <span className="text-white font-medium text-[1.5rem] truncate max-w-[16rem]">
          {name || subline}
        </span>
        <span className="text-zinc-400 text-[1.3rem] truncate max-w-[16rem]">
          {subline}
        </span>
      </div>
    </li>
  );
}
