type Props = { label: string };

export default function DateSeparator({ label }: Props) {
  return (
    <div className="w-full flex justify-center my-[1.2rem]">
      <span className="bg-zinc-800 text-zinc-300 text-[1.2rem] px-[0.8rem] py-[0.3rem] rounded-full">
        {label}
      </span>
    </div>
  );
}
