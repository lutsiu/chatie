import { Icon } from '@iconify/react';

type Props = {
  query: string;
  setQuery: (value: string) => void;
  setIsSearching: (value: boolean) => void;
  isSearching: boolean;
};

export default function SearchBar({
  query,
  setQuery,
  setIsSearching,
  isSearching,
}: Props) {

  console.log(query)
  return (
    <div className="relative flex-1">
      <Icon
        icon="ph:magnifying-glass-thin"
        className={`absolute top-1/2 left-[1.2rem] -translate-y-1/2 w-[1.8rem] h-[1.8rem] 
          ${isSearching ? 'text-purple-500' : 'text-gray-400'}`}
      />
      <input
        type="text"
        placeholder="Search"
        value={query}
        onClick={() => setIsSearching(true)}
        onChange={(e) => setQuery(e.target.value)}
        className={`w-full bg-zinc-800 text-white rounded-full 
          py-[0.6rem] pl-[3.8rem] pr-[1.5rem] text-[1.4rem] outline-none placeholder-gray-400 
          border-[1px] duration-200
          ${isSearching ? 'border-purple-500' : 'border-gray-700 hover:border-gray-500'}`}
      />
    </div>
  );
}
