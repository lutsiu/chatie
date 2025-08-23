type Props = { name: string; email: string };

export default function ContactListItem({ name, email }: Props) {
  const initials = name
    .split(" ")
    .map((s) => s[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");

  return (
    <li className="flex gap-[1.2rem] items-center px-[1.5rem] py-[1.1rem] hover:bg-zinc-800 cursor-pointer rounded-[1rem]">
      <div className="w-[4.5rem] h-[4.5rem] rounded-full bg-zinc-700 flex items-center justify-center text-[1.6rem]">
        {initials || "?"}
      </div>
      <div className="flex flex-col border-b border-zinc-800 pb-[0.4rem]">
        <span className="text-white font-medium text-[1.5rem]">{name}</span>
        <span className="text-zinc-400 text-[1.3rem] truncate max-w-[16rem]">{email}</span>
      </div>
    </li>
  );
}
