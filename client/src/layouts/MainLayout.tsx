import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import SidePanel from "../components/Sidebar/SidePanel";
import MediaViewerOverlay from "../components/Viewer/MediaViewerOverlay";
import { useSelectedChatId } from "../store/chats";

export default function MainLayout() {
  const chatId = useSelectedChatId();
  const hasChat = !!chatId;

  return (
    <div className="h-screen w-full relative bg-gray-950 text-white">
      {/* Desktop / Tablet (md+) — 3-pane layout */}
      <div className="hidden md:flex h-full w-full">
        <Sidebar />
        <SidePanel />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile (<md) */}
      <div className="md:hidden h-full w-full">
        {/* When NO chat is selected: show Sidebar + SidePanel stacked full-width */}
        <div className={`${hasChat ? "hidden" : "flex"} h-full flex-col`}>
          <Sidebar />
          <SidePanel />
        </div>

        {/* When a chat IS selected: show chat full-width */}
        <div className={`${hasChat ? "block" : "hidden"} h-full`}>
          <main className="h-full w-full">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Overlay lives once at the root so it works in every mode */}
      <MediaViewerOverlay />
    </div>
  );
}
