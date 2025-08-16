import DateSeparator from "./DateSeparator";
import MessageBubble from "./MessageBubble";

const mock = [
  { id: 1, text: "Привіт, ще ні, але я в школі мав наукову роботу...", time: "17:34", isOwn: false },
  { id: 2, text: "👉", time: "19:05", isOwn: true, status: "read" as const },
  { id: 3, text: "Привіт, сорян я напевно не...", time: "14:04", isOwn: false },
  { id: 4, text: "пон\nтоді бажаю швидшого одужання)", time: "14:04", isOwn: true, status: "read" as const },
  { id: 1, text: "Привіт, ще ні, але я в школі мав наукову роботу...", time: "17:34", isOwn: false },
  { id: 2, text: "👉", time: "19:05", isOwn: true, status: "read" as const },
  { id: 3, text: "Привіт, сорян я напевно не...", time: "14:04", isOwn: false },
  { id: 4, text: "пон\nтоді бажаю швидшого одужання)", time: "14:04", isOwn: true, status: "read" as const },
];

export default function MessageList() {
  return (
    <div
      className="flex-1 overflow-y-auto "
      // feel free to swap the bg image with your own subtle pattern
    >
      <div className="py-[1.6rem] space-y-[0.8rem]">
        {mock.slice(0, 2).map(m => (
          <MessageBubble key={m.id} text={m.text} time={m.time} isOwn={m.isOwn} status={m.status} />
        ))}
        <DateSeparator label="Today" />
        {mock.slice(2).map(m => (
          <MessageBubble key={m.id} text={m.text} time={m.time} isOwn={m.isOwn} status={m.status} />
        ))}
      </div>
    </div>
  );
}
