import { Icon } from "@iconify/react";
import { useState } from "react";
import { toast } from "sonner";
import { useContactsStore } from "../../../store/contacts";

type Props = { open: boolean; onClose: () => void };

export default function AddContactDialog({ open, onClose }: Props) {
  const { add, saving } = useContactsStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");

  if (!open) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await add({ firstName: firstName.trim(), lastName: lastName.trim() || undefined, email: email.trim().toLowerCase() });
      toast.success("Contact added");
      onClose();
      setFirstName(""); setLastName(""); setEmail("");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to add contact");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[48rem] max-w-[90vw] bg-zinc-900 border border-zinc-800 rounded-[1.2rem] p-[2.0rem] text-white">
        <div className="flex items-center justify-between mb-[1.2rem]">
          <div className="flex items-center gap-[1.2rem]">
            <button onClick={onClose} className="p-[0.8rem] rounded-full hover:bg-zinc-800">
              <Icon icon="solar:close-circle-linear" className="w-[2.4rem] h-[2.4rem]" />
            </button>
            <h3 className="text-[2.0rem] font-semibold">Add Contact</h3>
          </div>
          <button
            onClick={onSubmit as any}
            className="px-[1.6rem] py-[0.8rem] rounded-[0.8rem] bg-purple-600 hover:bg-purple-500 disabled:opacity-60"
            disabled={saving || !firstName.trim() || !email.trim()}
          >
            ADD
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-[1.2rem]">
          <div className="flex items-center gap-[1.2rem]">
            <div className="w-[8rem] h-[8rem] rounded-full bg-gradient-to-br from-purple-500/40 to-indigo-500/40" />
            <div className="flex-1 grid gap-[1.2rem]">
              <input
                className="w-full bg-zinc-800 border border-zinc-700 rounded-[0.8rem] px-[1.4rem] py-[1.2rem] outline-none"
                placeholder="First name (required)"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                className="w-full bg-zinc-800 border border-zinc-700 rounded-[0.8rem] px-[1.4rem] py-[1.2rem] outline-none"
                placeholder="Last name (optional)"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-[0.8rem]">
            <label className="block text-zinc-400 mb-[0.6rem] text-[1.3rem]">Email</label>
            <input
              type="email"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-[0.8rem] px-[1.4rem] py-[1.2rem] outline-none"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
}
