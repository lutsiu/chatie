import { useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { startOfDay } from 'date-fns';
import '../../styles/daypicker.css';

type Props = {
  open: boolean;
  onCancel: () => void;
  onJump: (date: Date) => void;
};

export default function ChatDatePickerModal({ open, onCancel, onJump }: Props) {
  const today = startOfDay(new Date());
  const [selected, setSelected] = useState<Date>(today);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div
        ref={modalRef}
        className="relative z-10 w-[34rem] rounded-[1.2rem] bg-zinc-900 text-white shadow-2xl border border-zinc-800 p-[1.6rem]"
      >
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={(d) => d && setSelected(startOfDay(d))}
          showOutsideDays
          /* Disable future days */
          disabled={{ after: today }}
          /* Optional: start the view near the selected date */
          defaultMonth={selected}
        />

        <div className="mt-[1.6rem] flex justify-between">
          <button
            onClick={onCancel}
            className="px-[1.2rem] py-[0.8rem] rounded-full hover:bg-zinc-800 text-[1.3rem]"
          >
            CANCEL
          </button>
          <button
            onClick={() => onJump(selected)}
            className="px-[1.2rem] py-[0.8rem] rounded-full text-purple-400 hover:bg-purple-500/10 text-[1.3rem]"
          >
            JUMP TO DATE
          </button>
        </div>
      </div>
    </div>
  );
}
