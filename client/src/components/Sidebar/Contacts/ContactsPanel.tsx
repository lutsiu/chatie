import { Icon } from '@iconify/react';
import SearchBar from '../Search/SearchBar';
import { useState } from 'react';

const mockContacts = [
  { id: 1, name: 'Contact1', username: 'contact1', avatar: 'https://www.cdc.gov/healthy-pets/media/images/2024/04/Cat-on-couch.jpg', lastSeen: 'online' },
  { id: 2, name: 'Contact2', username: 'contact1', avatar: 'https://www.cdc.gov/healthy-pets/media/images/2024/04/Cat-on-couch.jpg', lastSeen: 'last seen just now' },
  { id: 3, name: 'Contact3', username: 'contact1', avatar: 'https://www.cdc.gov/healthy-pets/media/images/2024/04/Cat-on-couch.jpg', lastSeen: 'last seen 5 minutes ago' },
  // Add more dummy data
];

type Props = {
  onClose: () => void;
};

export default function ContactsPanel({ onClose }: Props) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

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
        <SearchBar
          query={query}
          setQuery={setQuery}
          setIsSearching={setIsSearching}
          isSearching={isSearching}
        />
      </div>

      {/* Contact list */}
      <ul className="mt-[1.4rem] overflow-y-auto px-[0.5rem]">
        {mockContacts
          .filter(contact =>
            contact.name.toLowerCase().includes(query.toLowerCase())
          )
          .map(contact => (
            <li
              key={contact.id}
              className="flex gap-[1.2rem] items-center px-[1.5rem] py-[1.1rem] hover:bg-zinc-800 cursor-pointer rounded-[1rem]"
            >
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-[4.5rem] h-[4.5rem] rounded-full object-cover"
              />
              <div className="flex flex-col border-b border-zinc-800 pb-[0.4rem]">
                <span className="text-white font-medium text-[1.5rem]">{contact.name}</span>
                <span className="text-zinc-400 text-[1.3rem] truncate max-w-[16rem]">{contact.lastSeen}</span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
