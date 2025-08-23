// src/components/Contacts/ContactsPanel.tsx
import { Icon } from "@iconify/react";
import SearchBar from "../Search/SearchBar";
import { useEffect, useMemo, useState } from "react";
import ContactListItem from "./ContactListItem";
import AddContactDialog from "./AddContactDialog";
import { toast } from "sonner";
import { useContactsStore } from "../../../store/contacts";

type Props = { onClose: () => void };

export default function ContactsPanel({ onClose }: Props) {
  const { items, fetch, loading, error } = useContactsStore();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => { fetch().catch(() => {}); }, [fetch]);

  // basic debounce for search
  useEffect(() => {
    if (!isSearching) return;
    const id = setTimeout(() => fetch(query).catch(() => {}), 300);
    return () => clearTimeout(id);
  }, [isSearching, query, fetch]);

  useEffect(() => { if (error) toast.error(error); }, [error]);

  const visible = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(c =>
      `${c.firstName} ${c.lastName ?? ""}`.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <div className="absolute top-0 left-0 w-[28rem] h-full bg-zinc-900 border-r border-zinc-800 z-40 flex flex-col">
      {/* Header with back button and search */}
      <div className="flex items-center gap-[2rem] pt-[1rem] px-[2.5rem]">
        <button
          onClick={onClose}
          className="w-[3.6rem] h-[3.6rem] flex items-center justify-center rounded-full hover:bg-zinc-800"
        >
          <Icon icon="solar:arrow-left-linear" className="w-[2.5rem] h-[2.5rem] text-white" />
        </button>
        <SearchBar query={query} setQuery={setQuery} setIsSearching={setIsSearching} isSearching={isSearching} />
      </div>

      {/* Contact list */}
      <ul className="mt-[1.4rem] overflow-y-auto px-[0.5rem]">
        {loading && (
          <li className="px-[1.5rem] py-[1.1rem] text-[1.4rem] text-zinc-400">Loading…</li>
        )}
        {!loading && visible.map(c => (
          <ContactListItem
            key={c.id}
            name={`${c.firstName} ${c.lastName ?? ""}`.trim()}
            email={c.email}
          />
        ))}
        {!loading && visible.length === 0 && (
          <li className="px-[1.5rem] py-[1.1rem] text-[1.4rem] text-zinc-400">No contacts</li>
        )}
      </ul>

      {/* FAB: add contact */}
      <button
        onClick={() => setOpenAdd(true)}
        className="absolute right-[2rem] bottom-[2rem] rounded-full w-[5.6rem] h-[5.6rem] bg-purple-600 hover:bg-purple-500 shadow-xl flex items-center justify-center"
        aria-label="Add contact"
      >
        <Icon icon="solar:add-circle-bold" className="w-[2.8rem] h-[2.8rem] text-white" />
      </button>

      {/* Dialog */}
      <AddContactDialog open={openAdd} onClose={() => setOpenAdd(false)} />
    </div>
  );
}
