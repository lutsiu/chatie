import { Icon } from "@iconify/react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
};

export function SearchField({ value, onChange, onClear }: Props) {
  return (
    <div className="relative flex-1 min-w-0">
      <Icon
        icon="ph:magnifying-glass-thin"
        className="absolute left-[1.2rem] top-1/2 -translate-y-1/2 w-[1.8rem] h-[1.8rem] text-gray-300"
      />
      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search"
        className="w-full bg-zinc-800 text-white rounded-full h-[3.6rem] pl-[3.8rem] pr-[4.2rem] text-[1.4rem] outline-none border border-gray-700 focus:border-purple-500"
      />
      <button
        onClick={onClear}
        className="absolute right-[0.8rem] top-1/2 -translate-y-1/2 p-[0.4rem] rounded-full hover:bg-zinc-700"
        aria-label="Clear search"
      >
        <Icon icon="ph:x-bold" className="w-[1.6rem] h-[1.6rem] text-gray-300" />
      </button>
    </div>
  );
}
