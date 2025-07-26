import Hamburger from "./Hamburger/Hamburger";
import SearchBar from "./Search/SearchBar";

type Props = {
  query: string;
  setQuery: (value: string) => void;
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
  clearSearch: () => void;
};

export default function SidebarHeader({
  query,
  setQuery,
  isSearching,
  setIsSearching,
  clearSearch,
}: Props) {
  return (
    <header className="pt-[1rem] px-[2.5rem]">
      <nav className="flex items-center gap-[2rem]">
        <Hamburger isSearching={isSearching} clearSearch={clearSearch} />
        <SearchBar
          query={query}
          setQuery={setQuery}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
        />
      </nav>
    </header>
  );
}
