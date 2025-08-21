export default function Counter({ current, total }: { current: number; total: number }) {
  return (
    <div className="absolute bottom-[1.2rem] right-[1.6rem] text-white/80 text-[1.2rem]">
      {current} / {total}
    </div>
  );
}
