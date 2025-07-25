import { Icon } from '@iconify/react';

type Props = {
  query: string;
  setQuery: (value: string) => void;
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
};

export default function SidebarHeader({
  query,
  setQuery,
  isSearching,
  setIsSearching,
}: Props) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const clearSearch = () => {
    setQuery("");
    setIsSearching(false);
  };

  return (
    <header className="pt-[1rem] px-[2.5rem]">
      <nav className="flex items-center gap-[2rem]">
        <button onClick={isSearching ? clearSearch : undefined}>
          <Icon
            icon={
              isSearching
                ? 'solar:arrow-left-linear'
                : 'solar:hamburger-menu-linear'
            }
            className="w-[2.5rem] h-[2.5rem] text-white cursor-pointer"
          />
        </button>

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
            onChange={handleSearch}
            className={`w-full bg-zinc-800 text-white rounded-full 
              py-[0.6rem] pl-[3.8rem] pr-[1.5rem] text-[1.4rem] outline-none placeholder-gray-400 
              border-[1px] duration-200
              ${isSearching ? 'border-purple-500' : 'border-gray-700 hover:border-gray-500'}`}
          />
        </div>
      </nav>
    </header>
  );
}
