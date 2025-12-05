import { Icon } from "@iconify/react";
import { useSidePanelStore } from "../../../store/useSidePanelStore";
import { useAuthStore } from "../../../store/auth";
import { useNavigate } from "react-router-dom";

type Props = { onBack: () => void; onClose: () => void };

const AVATAR_FALLBACK =
  "data:image/svg+xml;utf8,\
  <svg xmlns='http://www.w3.org/2000/svg' width='112' height='112'>\
    <rect width='100%' height='100%' rx='56' fill='%231f2937'/>\
    <text x='50%' y='53%' font-family='Inter,system-ui' font-size='44' text-anchor='middle' fill='%23ffffff'>?</text>\
  </svg>";

export default function SettingsView({ onBack }: Props) {
  const open = useSidePanelStore((s) => s.open);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const displayName =
    (user?.firstName || user?.lastName)
      ? `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()
      : user?.username ?? "User";

  const avatar = user?.profilePictureUrl || AVATAR_FALLBACK;

  const handleLogout = () => {
    logout();                  // clear auth in Zustand (+ localStorage)
    navigate("/auth/login");   // redirect to login page
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-[1.6rem] py-[1.2rem] border-b border-zinc-800">
        <div className="flex items-center gap-[1.2rem]">
          <button onClick={onBack} className="p-[0.8rem] rounded-full hover:bg-zinc-800">
            <Icon icon="solar:arrow-left-linear" className="w-[2.4rem] h-[2.4rem]" />
          </button>
          <h2 className="text-[1.8rem] font-semibold">Settings</h2>
        </div>

        <div className="flex gap-[1.2rem]">
          <button onClick={() => open("editProfile")}>
            <Icon
              icon="solar:pen-linear"
              className="w-[2.4rem] h-[2.4rem] cursor-pointer hover:text-purple-400"
            />
          </button>

          <button onClick={handleLogout}>
            <Icon
              icon="solar:logout-linear"
              className="w-[2.4rem] h-[2.4rem] cursor-pointer hover:text-purple-400"
            />
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="flex flex-col items-center p-[2.4rem] border-b border-zinc-800">
        <img
          src={avatar}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = AVATAR_FALLBACK;
          }}
          alt="Avatar"
          className="w-[11.2rem] h-[11.2rem] rounded-full object-cover"
        />
        <h3 className="mt-[1.2rem] text-[2rem] font-semibold">{displayName}</h3>
        <span className="text-[1.3rem] text-zinc-400">@{user?.username ?? "unknown"}</span>
      </div>

      {/* Details */}
      <div className="flex flex-col p-[2.4rem] gap-[2.0rem]">
        {/* Email */}
        <div className="flex items-center gap-[1.6rem]">
          <Icon icon="mdi:email-outline" className="w-[2.4rem] h-[2.4rem] text-zinc-400" />
          <div>
            <p className="text-[1.6rem] text-white">{user?.email ?? "—"}</p>
            <p className="text-[1.3rem] text-zinc-400">Email</p>
          </div>
        </div>

        {/* Username */}
        <div className="flex items-center gap-[1.6rem]">
          <Icon icon="mdi:at" className="w-[2.4rem] h-[2.4rem] text-zinc-400" />
          <div>
            <p className="text-[1.6rem] text-white">@{user?.username ?? "—"}</p>
            <p className="text-[1.3rem] text-zinc-400">Username</p>
          </div>
        </div>

        {/* Bio */}
        <div className="flex items-center gap-[1.6rem]">
          <Icon icon="mdi:information-outline" className="w-[2.4rem] h-[2.4rem] text-zinc-400" />
          <div>
            <p className="text-[1.6rem] text-white">{user?.about ?? "No bio yet"}</p>
            <p className="text-[1.3rem] text-zinc-400">Bio</p>
          </div>
        </div>
      </div>
    </div>
  );
}
