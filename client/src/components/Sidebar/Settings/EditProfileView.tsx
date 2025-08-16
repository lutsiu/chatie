import { Icon } from "@iconify/react";

type Props = { onBack: () => void };

export default function EditProfileView({ onBack }: Props) {
  return (
    <div className="flex flex-col h-full bg-zinc-900 text-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-[1.2rem] px-[1.6rem] py-[1.2rem] border-b border-zinc-800">
        <button onClick={onBack} className="p-[0.8rem] rounded-full hover:bg-zinc-800">
          <Icon icon="solar:arrow-left-linear" className="w-[2.4rem] h-[2.4rem]" />
        </button>
        <h2 className="text-[1.8rem] font-semibold">Edit Profile</h2>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center p-[2.4rem]">
        <div className="relative">
          <img
            src="https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg"
            alt="Avatar"
            className="w-[11.2rem] h-[11.2rem] rounded-full object-cover"
          />
          <div className="absolute right-[0.6rem] bottom-[0.6rem] bg-zinc-800 rounded-full p-[0.6rem]">
            <Icon icon="mdi:camera-plus-outline" className="w-[2rem] h-[2rem]" />
          </div>
        </div>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-[1.6rem] px-[1.6rem] pb-[2.4rem]">
        <div>
          <label className="block text-zinc-400 mb-[0.6rem] text-[1.3rem]">Name</label>
          <input
            className="w-full bg-zinc-800 border border-zinc-700 rounded-[0.8rem] px-[1.2rem] py-[1.2rem] outline-none focus:border-purple-500"
            defaultValue="Саша"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-[0.6rem] text-[1.3rem]">Last Name</label>
          <input
            className="w-full bg-zinc-800 border border-zinc-700 rounded-[0.8rem] px-[1.2rem] py-[1.2rem] outline-none focus:border-purple-500"
            placeholder="Last Name"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-[0.6rem] text-[1.3rem]">Bio (optional)</label>
          <textarea
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-[0.8rem] px-[1.2rem] py-[1.2rem] outline-none focus:border-purple-500"
            defaultValue="ramble on!"
          />
        </div>

        <div className="mt-[1.2rem]">
          <p className="text-zinc-400 text-[1.3rem]">
            Any details such as age, occupation or city.<br />
            Example: 23 y.o. designer from San Francisco
          </p>
        </div>

        <div className="mt-[2.4rem]">
          <h3 className="text-[1.6rem] font-semibold text-purple-400 mb-[1.2rem]">Username</h3>
          <label className="block text-zinc-400 mb-[0.6rem] text-[1.3rem]">Username (optional)</label>
          <input
            className="w-full bg-zinc-800 border border-zinc-700 rounded-[0.8rem] px-[1.2rem] py-[1.2rem] outline-none focus:border-purple-500"
            defaultValue="lutsiu"
          />
        </div>

        <div className="flex gap-[1.2rem] mt-[2.4rem]">
          <button type="button" className="px-[1.6rem] py-[1.0rem] rounded-[0.8rem] bg-zinc-800 hover:bg-zinc-700">
            Cancel
          </button>
          <button type="submit" className="px-[1.6rem] py-[1.0rem] rounded-[0.8rem] bg-purple-600 hover:bg-purple-500">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
