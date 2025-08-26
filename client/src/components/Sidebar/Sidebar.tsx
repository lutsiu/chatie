import { useState } from "react";
import SidebarHeader from "./SidebarHeader";
import ChatList from "./ChatList/ChatList";
import SearchList from "./Search/SearchList";
import SettingsView from "./Settings/SettingsView";
import ContactsPanel from "./Contacts/ContactsPanel"; // ← add

export default function Sidebar() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showContacts, setShowContacts] = useState(false); // ← add

  const clearSearch = () => {
    setQuery("");
    setIsSearching(false);
  };

  const openSettings = () => setShowSettings(true);
  const closeSettings = () => setShowSettings(false);

  const openContacts = () => setShowContacts(true);   // ← add
  const closeContacts = () => setShowContacts(false); // ← add

  return (
    <aside className="relative w-[28rem] bg-zinc-900 h-full border-r border-zinc-800 flex flex-col">
      {showSettings ? (
        <SettingsView onBack={closeSettings} onClose={closeSettings} />
      ) : (
        <>
          <SidebarHeader
            query={query}
            setQuery={setQuery}
            isSearching={isSearching}
            setIsSearching={setIsSearching}
            clearSearch={clearSearch}
            onOpenSettings={openSettings}
            onOpenContacts={openContacts}   // ← pass down
          />
          <div className="p-4 text-white text-sm">
            {isSearching ? <SearchList query={query}/> : <ChatList />}
          </div>
        </>
      )}

      {/* Contacts overlay */}
      {showContacts && <ContactsPanel onClose={closeContacts} />}
    </aside>
  );
}
