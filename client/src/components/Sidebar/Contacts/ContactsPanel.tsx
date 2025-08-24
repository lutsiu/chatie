// src/components/Sidebar/Contacts/ContactsPanel.tsx
import { Icon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import SearchBar from "../Search/SearchBar";
import ContactListItem from "./ContactListItem";
import AddContactDialog from "./AddContactDialog";
import { useContactsStore } from "../../../store/contacts";

type Props = { onClose: () => void };

export default function ContactsPanel({ onClose }: Props) {
  const { items, loading, fetch, error } = useContactsStore();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      fetch(query.trim() || undefined);
    }, 300);
    return () => clearTimeout(t);
  }, [query, fetch]);

  const list = useMemo(() => items, [items]);

  return (
    <div className="absolute top-0 left-0 w-[28rem] h-full bg-zinc-900 border-r border-zinc-800 z-40 flex flex-col">
      <div className="flex items-center gap-[2rem] pt-[1rem] px-[2.5rem]">
        <button
          onClick={onClose}
          className="w-[3.6rem] h-[3.6rem] flex items-center justify-center rounded-full hover:bg-zinc-800"
          title="Back"
        >
          <Icon icon="solar:arrow-left-linear" className="w-[2.5rem] h-[2.5rem] text-white" />
        </button>
        <SearchBar
          query={query}
          setQuery={setQuery}
          setIsSearching={setIsSearching}
          isSearching={isSearching}
        />
      </div>

      {/* Contact list */}
      <div className="mt-[1.4rem] overflow-y-auto px-[0.5rem] pb-[6rem]">
        {loading ? (
          <div className="px-[1.5rem] py-[1.1rem] text-zinc-400 text-[1.3rem]">Loading…</div>
        ) : error ? (
          <div className="px-[1.5rem] py-[1.1rem] text-red-300 text-[1.3rem]">{error}</div>
        ) : list.length === 0 ? (
          <div className="px-[1.5rem] py-[1.1rem] text-zinc-400 text-[1.3rem]">
            {query ? "No contacts match your search." : "No contacts yet."}
          </div>
        ) : (
          <ul>
            {list.map((c) => {
              const name = `${c.firstName ?? ""}${c.lastName ? " " + c.lastName : ""}`.trim();
              const avatar =
                // prefer linked user's avatar if present, then contact's own, then initials
                (c as any).linkedUserProfilePictureUrl ??
                (c as any).profilePictureUrl ??
                `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                  name || c.email
                )}&fontWeight=700`;

              return (
                <ContactListItem
                  key={c.id}
                  name={name || c.email.split("@")[0]}
                  avatar={avatar}
                  subline={c.email}
                />
              );
            })}
          </ul>
        )}
      </div>

      {/* Floating add button */}
      <button
        onClick={() => setOpenAdd(true)}
        className="absolute right-[1.6rem] bottom-[1.6rem] w-[4.8rem] h-[4.8rem] rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center shadow-lg"
        title="Add contact"
      >
        <Icon icon="solar:add-circle-linear" className="w-[2.8rem] h-[2.8rem] text-white" />
      </button>

      {/* Add contact dialog */}
      <AddContactDialog open={openAdd} onClose={() => setOpenAdd(false)} />
    </div>
  );
}
