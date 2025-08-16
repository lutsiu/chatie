import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";

import MediaViewerOverlay from "../components/Viewer/MediaViewerOverlay";
import SidePanel from "../components/Sidebar/SidePanel";

export default function MainLayout() {
  return (
    <div className="h-screen w-full flex relative">
      <Sidebar />
      <SidePanel /> 
      <main className="flex-1 bg-gray-950 text-white">
        <Outlet />
        <MediaViewerOverlay/>
      </main>
    </div>
  );
}
