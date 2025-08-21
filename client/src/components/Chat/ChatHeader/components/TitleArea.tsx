type Props = { title?: string; subtitle?: string };

export function TitleArea({
  title = "Valery",
  subtitle = "last seen recently",
}: Props) {
  return (
    <div className="min-w-0 flex-1">
      <div className="text-white text-[1.6rem] font-semibold truncate">{title}</div>
      <div className="text-zinc-400 text-[1.2rem] truncate">{subtitle}</div>
    </div>
  );
}
