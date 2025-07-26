type Props = {
  name: string;
  message: string;
  time: string;
  avatar: string;
  isRead?: boolean;
  isOwn?: boolean;
};

export default function ChatListItem({
  name,
  message,
  time,
  avatar,
  isRead = false,
  isOwn = false,
}: Props) {
  return (
    <li className="flex gap-[1.2rem] items-center px-[1.5rem] py-[1.1rem] hover:bg-zinc-800 cursor-pointer  rounded-[1rem]">
      {/* Avatar */}
      <img
        src={avatar}
        alt={name}
        className="w-[4.5rem] h-[4.5rem] rounded-full object-cover"
      />

      {/* Content */}
      <div className="flex-1 border-b border-zinc-800 pb-[0.4rem]">
        <div className="flex justify-between items-center">
          <span className="text-white font-medium text-[1.5rem]">{name}</span>
          <div className="flex items-center gap-[0.7rem]">
            {/* Read icon (fake for now) */}
            {isRead && (
              <span className="text-purple-500 text-[1.3rem] ml-[0.6rem]">✔✔</span>
            )}
            <span className="text-zinc-400 text-[1.2rem]">{time}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-400 text-[1.3rem] truncate max-w-[15rem]">
            {isOwn ? "You: " : ""}
            {message.length > 30 ? `${message.slice(0, 30)}...` : message}
          </span>

          
        </div>
      </div>
    </li>
  );
}
