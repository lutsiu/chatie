import { Icon } from "@iconify/react";
import { useEditMessage } from "../../../store/useEditMessage";

export default function EditBanner() {
  const { target, clear } = useEditMessage();

  if (!target) return null;

  return (
    <div className="px-[1.6rem] py-[0.6rem] bg-amber-900/30 border-b border-amber-700 flex items-center justify-between">
      <div className="flex items-center gap-[0.6rem] text-amber-100 text-[1.3rem]">
        <Icon icon="solar:pen-linear" className="w-[1.6rem] h-[1.6rem]" />
        <span>Editing message</span>
      </div>
      <button
        onClick={clear}
        className="text-amber-200 hover:text-white text-[1.2rem]"
      >
        Cancel
      </button>
    </div>
  );
}