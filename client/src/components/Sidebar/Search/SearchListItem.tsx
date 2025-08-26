type Props = {
  name: string;
  username: string;
  avatar: string;
  onClick?: () => void;
};

export default function SearchListItem({ name, username, avatar, onClick }: Props) {
  return (
    <li
      onClick={onClick}
      className="flex gap-[1.2rem] items-center px-[1.5rem] py-[1.1rem] hover:bg-zinc-800 cursor-pointer rounded-[1rem]"
    >
      <img
        src={avatar}
        alt={name}
        className="w-[4.5rem] h-[4.5rem] rounded-full object-cover"
      />
      <div className="flex flex-col border-b border-zinc-800 pb-[0.4rem]">
        <span className="text-white font-medium text-[1.5rem]">{name}</span>
        <span className="text-zinc-400 text-[1.3rem] truncate max-w-[16rem]">@{username}</span>
      </div>
    </li>
  );
}
