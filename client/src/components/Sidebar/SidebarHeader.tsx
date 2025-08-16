import Hamburger from "./Hamburger/Hamburger";
import SearchBar from "./Search/SearchBar";

type Props = {
  query: string;
  setQuery: (v: string) => void;
  isSearching: boolean;
  setIsSearching: (v: boolean) => void;
  clearSearch: () => void;
  onOpenSettings: () => void;
  onOpenContacts: () => void;   // ← add
};

export default function SidebarHeader({
  query,
  setQuery,
  isSearching,
  setIsSearching,
  clearSearch,
  onOpenSettings,
  onOpenContacts,                // ← add
}: Props) {
  return (
    <header className="pt-[1rem] px-[2.5rem]">
      <nav className="flex items-center gap-[2rem]">
        <Hamburger
          isSearching={isSearching}
          clearSearch={clearSearch}
          onOpenSettings={onOpenSettings}
          onOpenContacts={onOpenContacts}   // ← pass to hamburger
        />
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
