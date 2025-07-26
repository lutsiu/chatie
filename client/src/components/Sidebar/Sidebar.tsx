import { useState } from "react";
import SidebarHeader from "./SidebarHeader";
import ChatList from "./ChatList";
import SearchList from "./SearchList";

export default function Sidebar() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const clearSearch = () => {
    setQuery("");
    setIsSearching(false);
  };

  return (
    <aside className="w-[28rem] bg-zinc-900 h-full border-r border-zinc-800 flex flex-col">
      <SidebarHeader
        query={query}
        setQuery={setQuery}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
        clearSearch={clearSearch}
      />

      <div className="p-4 text-white text-sm">
        {isSearching ? (
          <SearchList/>
        ) : (
          <ChatList/>
        )}
      </div>
    </aside>
  );
}
