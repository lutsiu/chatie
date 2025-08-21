import { useState } from "react";

export default function Toggle() {
  const [on, setOn] = useState(true);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`w-[4.8rem] h-[2.6rem] rounded-full transition-colors ${
        on ? "bg-purple-500/80" : "bg-zinc-700"
      } relative`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-[0.2rem] left-[0.2rem] h-[2.2rem] w-[2.2rem] bg-white rounded-full transition-transform ${
          on ? "translate-x-[2.2rem]" : ""
        }`}
      />
    </button>
  );
}
