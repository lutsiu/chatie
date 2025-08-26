// src/components/Chat/Header/components/AvatarButton.tsx
type Props = { onClick: () => void; src?: string; alt?: string };

export function AvatarButton({
  onClick,
  src = "",
  alt = "Avatar",
}: Props) {
  return (
    <button onClick={onClick} className="shrink-0">
      <img
        src={src || "https://api.dicebear.com/9.x/initials/svg?seed=User"}
        alt={alt}
        className="w-[3.6rem] h-[3.6rem] rounded-full object-cover"
      />
    </button>
  );
}
