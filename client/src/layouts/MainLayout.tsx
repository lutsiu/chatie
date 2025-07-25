import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";

export default function MainLayout() {
  return (
    <div className="h-screen w-full flex">
      {/* Left sidebar placeholder (chat list, settings, etc.) */}
      <Sidebar/>

      {/* Main chat area */}
      <main className="flex-1 bg-gray-950 text-white">
        <Outlet />
      </main>
    </div>
  );
}
