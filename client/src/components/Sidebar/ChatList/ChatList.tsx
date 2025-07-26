import { useState } from "react";
import ChatListItem from "./ChatListItem";

const mockChats = [
  {
    id: 1,
    name: "User",
    message: "some long message lagioerjgjerogreoigeiogierngergn",
    time: "13:48",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/960px-Cat_November_2010-1a.jpg",
    isRead: true,
  },
  {
    id: 2,
    name: "Andrzej",
    message: "топчик",
    time: "12:26",
    avatar:
      "https://www.petprofessional.com.au/wp-content/uploads/2020/02/grey-and-black-cat.jpg",
    isRead: false,
    isOwn: true,
  },
];

export default function ChatList() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [contextPos, setContextPos] = useState({ x: 0, y: 0 });

  return (
    <ul className="flex flex-col">
      {mockChats.map((chat) => (
        <ChatListItem
          key={chat.id}
          {...chat}
          {...chat}
          isMenuOpen={openId === chat.id}
          onOpenContextMenu={(id, x, y) => {
            setOpenId(id);
            setContextPos({ x, y });
          }}
          onCloseContextMenu={() => setOpenId(null)}
          menuPosition={contextPos}
        />
      ))}
    </ul>
  );
}
