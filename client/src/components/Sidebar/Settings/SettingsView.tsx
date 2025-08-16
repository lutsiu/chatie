import { Icon } from "@iconify/react";
import { useSidePanelStore } from "../../../store/useSidePanelStore";

type Props = { onBack: () => void; onClose: () => void };

export default function SettingsView({ onBack }: Props) {
  const open = useSidePanelStore(s => s.open);

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-[1.6rem] py-[1.2rem] border-b border-zinc-800">
        <div className="flex items-center gap-[1.2rem]">
          <button onClick={onBack} className="p-[0.8rem] rounded-full hover:bg-zinc-800">
            <Icon icon="solar:arrow-left-linear" className="w-[2.4rem] h-[2.4rem]" />
          </button>
          <h2 className="text-[1.6rem] font-semibold">Settings</h2>
        </div>
        <div className="flex gap-[1.2rem]">
          <button onClick={() => open('editProfile')}>
            <Icon icon="solar:pen-linear" className="w-[2.4rem] h-[2.4rem] cursor-pointer hover:text-purple-400" />
          </button>
          <Icon icon="solar:menu-dots-bold" className="w-[2.4rem] h-[2.4rem] cursor-pointer hover:text-purple-400" />
        </div>
      </div>

      {/* User Info */}
      <div className="flex flex-col items-center p-[2.4rem] border-b border-zinc-800">
        <img
          src="https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg"
          alt="Avatar"
          className="w-[11.2rem] h-[11.2rem] rounded-full object-cover"
        />
        <h3 className="mt-[1.2rem] text-[2rem] font-semibold">Саша</h3>
        <span className="text-[1.4rem] text-green-400">online</span>
      </div>

      {/* Details */}
      <div className="flex flex-col p-[2.4rem] gap-[2.4rem]">
        <div className="flex items-center gap-[1.6rem]">
          <Icon icon="solar:phone-linear" className="w-[2.4rem] h-[2.4rem] text-zinc-400" />
          <div>
            <p className="text-[1.6rem] text-white">+48 501 247 687</p>
            <p className="text-[1.3rem] text-zinc-400">Phone</p>
          </div>
        </div>

        <div className="flex items-center gap-[1.6rem]">
          <Icon icon="mdi:at" className="w-[2.4rem] h-[2.4rem] text-zinc-400" />
          <div>
            <p className="text-[1.6rem] text-white">lutsiu</p>
            <p className="text-[1.3rem] text-zinc-400">Username</p>
          </div>
        </div>

        <div className="flex items-center gap-[1.6rem]">
          <Icon icon="mdi:information-outline" className="w-[2.4rem] h-[2.4rem] text-zinc-400" />
          <div>
            <p className="text-[1.6rem] text-white">ramble on!</p>
            <p className="text-[1.3rem] text-zinc-400">Bio</p>
          </div>
        </div>
      </div>
    </div>
  );
}
