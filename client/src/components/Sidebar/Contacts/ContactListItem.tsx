
type Props = {
  name: string;
  avatar: string;
  lastSeen: string;
};

export default function ContactListItem({ name, avatar, lastSeen }: Props) {
  return (
    <li className="flex gap-[1.2rem] items-center px-[1.5rem] py-[1.1rem] hover:bg-zinc-800 cursor-pointer rounded-[1rem]">
      <img
        src={avatar}
        alt={name}
        className="w-[4.5rem] h-[4.5rem] rounded-full object-cover"
      />
      <div className="flex flex-col border-b border-zinc-800 pb-[0.4rem]">
        <span className="text-white font-medium text-[1.5rem]">{name}</span>
        <span className="text-zinc-400 text-[1.3rem] truncate max-w-[16rem]">
          {lastSeen}
        </span>
      </div>
    </li>
  );
}
