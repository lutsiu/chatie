import { useState } from "react";
import SidebarHeader from "./SidebarHeader";

export default function Sidebar() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  return (
    <aside className="w-[28rem] bg-zinc-900 h-full border-r border-zinc-800 flex flex-col">
      <SidebarHeader
        query={query}
        setQuery={setQuery}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
      />

      {/* Example placeholder: replace with search results or chat list */}
      <div className="p-4 text-white text-sm">
        {isSearching ? (
          <p>Searching for: <strong>{query}</strong></p>
        ) : (
          <p>Showing chat list</p>
        )}
      </div>
    </aside>
  );
}
