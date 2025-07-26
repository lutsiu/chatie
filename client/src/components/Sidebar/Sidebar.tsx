import { useState } from "react";
import SidebarHeader from "./SidebarHeader";
import ChatList from "./ChatList/ChatList";
import SearchList from "./Search/SearchList";
import ContactsPanel from "./Contacts/ContactsPanel"; // import the panel

export default function Sidebar() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showContacts, setShowContacts] = useState(true);

  const clearSearch = () => {
    setQuery("");
    setIsSearching(false);
  };

  return (
    <aside className="w-[28rem] bg-zinc-900 h-full border-r border-zinc-800 flex flex-col relative">
      <SidebarHeader
        query={query}
        setQuery={setQuery}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
        clearSearch={clearSearch}
      />
      <div className="p-4 text-white text-sm overflow-y-auto">
        {isSearching ? <SearchList /> : <ChatList />}
      </div>
      {showContacts && <ContactsPanel onClose={() => setShowContacts(false)} />}
    </aside>
  );
}
