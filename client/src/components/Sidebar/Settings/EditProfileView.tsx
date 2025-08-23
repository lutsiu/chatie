import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../../store/auth";
import { useAccountStore } from "../../../store/account";

type Props = { onBack: () => void };

export default function EditProfileView({ onBack }: Props) {
  const user = useAuthStore((s) => s.user);
  const { updateMe, uploadAvatar, isSaving, isUploading, error } = useAccountStore();

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [about, setAbout] = useState(user?.about ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName ?? "");
    setAbout(user?.about ?? "");
    setUsername(user?.username ?? "");
  }, [user]);

  const fileRef = useRef<HTMLInputElement>(null);

  const avatar =
    user?.profilePictureUrl ||
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
      `${user?.firstName ?? ""} ${user?.lastName ?? user?.username ?? ""}`.trim() || "User"
    )}`;

  const onPickAvatar = () => fileRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      await uploadAvatar(f);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  const onSave = async () => {
    setBusy(true);
    try {
      await updateMe({
        firstName: firstName.trim(),
        lastName: (lastName ?? "").trim() || null,
        about: (about ?? "").trim() || null,
        username: username.trim(),
      });
    } finally {
      setBusy(false);
    }
  };

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
            src={avatar}
            alt="Avatar"
            className="w-[11.2rem] h-[11.2rem] rounded-full object-cover border border-zinc-700"
          />
          <button
            onClick={onPickAvatar}
            className="absolute right-[0.6rem] bottom-[0.6rem] bg-zinc-800 rounded-full p-[0.6rem] hover:bg-zinc-700 disabled:opacity-50"
            title="Change avatar"
            disabled={busy || isUploading}
          >
            <Icon icon="mdi:camera-plus-outline" className="w-[2rem] h-[2rem]" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
        </div>
        {(busy || isUploading) && <p className="mt-[0.8rem] text-[1.2rem] text-zinc-400">Uploading…</p>}
      </div>

      {/* Form */}
      <div className="flex flex-col gap-[1.6rem] px-[1.6rem] pb-[2.4rem]">
        {error && (
          <div className="border border-red-500/30 bg-red-500/10 text-red-300 rounded-[0.8rem] px-[1.2rem] py-[1.0rem] text-[1.3rem]">
            {error}
          </div>
        )}

        <div>
          <label className="block text-zinc-400 mb-[0.6rem] text-[1.3rem]">Name</label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-[0.8rem] px-[1.2rem] py-[1.2rem] outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-[0.6rem] text-[1.3rem]">Last Name</label>
          <input
            value={lastName ?? ""}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-[0.8rem] px-[1.2rem] py-[1.2rem] outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-[0.6rem] text-[1.3rem]">Bio (optional)</label>
          <textarea
            rows={3}
            value={about ?? ""}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-[0.8rem] px-[1.2rem] py-[1.2rem] outline-none focus:border-purple-500 resize-none"
          />
        </div>

        <div className="mt-[1.2rem]">
          <p className="text-zinc-400 text-[1.3rem]">
            Any details such as age, occupation or city.
            <br />
            Example: 23 y.o. designer from San Francisco
          </p>
        </div>

        <div className="mt-[2.4rem]">
          <h3 className="text-[1.6rem] font-semibold text-purple-400 mb-[1.2rem]">Username</h3>
          <label className="block text-zinc-400 mb-[0.6rem] text-[1.3rem]">Username (optional)</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-[0.8rem] px-[1.2rem] py-[1.2rem] outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex gap-[1.2rem] mt-[2.4rem]">
          <button
            type="button"
            onClick={onBack}
            className="px-[1.6rem] py-[1.0rem] rounded-[0.8rem] bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50"
            disabled={busy || isSaving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-[1.6rem] py-[1.0rem] rounded-[0.8rem] bg-purple-600 hover:bg-purple-500 disabled:opacity-50"
            disabled={busy || isSaving}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
