type Props = { onClick: () => void; src?: string; alt?: string };

export function AvatarButton({
  onClick,
  src = "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=200&auto=format&fit=crop",
  alt = "Avatar",
}: Props) {
  return (
    <button onClick={onClick} className="shrink-0">
      <img
        src={src}
        alt={alt}
        className="w-[3.6rem] h-[3.6rem] rounded-full object-cover"
      />
    </button>
  );
}
