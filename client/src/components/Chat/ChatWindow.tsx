import { useState } from "react";

import MessageList from "./MessageList";
import Composer from "./Composer";
import UserInfoPanel from "./UserInfoPanel";
import PinnedBanner from "./PinnedBanner";
import ChatHeader from "./ChatHeader";

const mockUser = {
  name: "ТВІЙ ЛІКАР В ПОЗНАНІ",
  username: "doctorpoznan",
  status: "last seen recently",
  avatar:
    "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=400&auto=format&fit=crop",
  media: Array.from({ length: 9 }).map((_, i) => ({
    id: i + 1,
    url: `https://picsum.photos/seed/chatmedia${i}/300/200`,
  })),
  files: [
    { id: 1, name: "report.pdf", size: "1.2 MB" },
    { id: 2, name: "invoice_2025.xlsx", size: "244 KB" },
    { id: 3, name: "notes.txt", size: "8 KB" },
  ],
};

export default function ChatWindow() {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <section className="relative h-full w-full flex flex-col bg-zinc-950">
      <ChatHeader onOpenProfile={() => setProfileOpen(true)} />
      <PinnedBanner/>
      <MessageList />
      <Composer />
      <UserInfoPanel
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={mockUser}
      />
    </section>
  );
}
