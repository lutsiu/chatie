import DateSeparator from "./DateSeparator";
import MessageBubble from "./MessageBubble";

type Msg = {
  id: number;
  time: string;
  isOwn: boolean;
  status?: "sent" | "delivered" | "read";
  text?: string;
  media?: { url: string; type: "image" | "video" }[];
  file?: { url: string; name: string; size: number; mime?: string };
};

const earlier: Msg[] = [
  {
    id: 1,
    time: "09:41",
    isOwn: false,
    text: "Привіт! Як настрій?",
  },
  {
    id: 2,
    time: "09:42",
    isOwn: true,
    status: "delivered",
    text: "Все гуд. Заливаю макети й оновлюю таски.",
  },
  {
    id: 3,
    time: "09:50",
    isOwn: false,
    media: [
      {
        url: "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=1200&auto=format&fit=crop",
        type: "image",
      },
    ],
  },
  {
    id: 4,
    time: "09:55",
    isOwn: true,
    status: "read",
    file: {
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      name: "Project-Brief.pdf",
      size: 43123,
      mime: "application/pdf",
    },
  },
];

const today: Msg[] = [
  {
    id: 5,
    time: "10:12",
    isOwn: false,
    text: "Подивись ці скріни",
    media: [
      {
        url: "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?q=80&w=1200&auto=format&fit=crop",
        type: "image",
      },
      {
        url: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1200&auto=format&fit=crop",
        type: "image",
      },
    ],
  },
  {
    id: 6,
    time: "10:14",
    isOwn: true,
    status: "read",
    text: "Круто виглядає! Є ще варіанти?",
    media: [
      {
        url: "https://images.unsplash.com/photo-1520975922325-24e4b4a2e86a?q=80&w=1200&auto=format&fit=crop",
        type: "image",
      },
      {
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
        type: "image",
      },
      {
        url: "https://images.unsplash.com/photo-1520975922325-24e4b4a2e86a?q=80&w=1200&auto=format&fit=crop",
        type: "image",
      },
    ],
  },
  {
    id: 7,
    time: "10:20",
    isOwn: false,
    text: "Ось PDF з поясненнями до макетів",
    file: {
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      name: "Design-Notes-v2.pdf",
      size: 128_400,
      mime: "application/pdf",
    },
  },
  {
    id: 8,
    time: "10:24",
    isOwn: true,
    status: "sent",
    media: [
      {
        url: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=1200&auto=format&fit=crop",
        type: "image",
      },
      {
        url: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=1200&auto=format&fit=crop",
        type: "image",
      },
      {
        url: "https://images.unsplash.com/photo-1484249170766-998fa6efe3c0?q=80&w=1200&auto=format&fit=crop",
        type: "image",
      },
      {
        url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
        type: "image",
      },
    ],
  },
  {
    id: 9,
    time: "10:31",
    isOwn: false,
    media: [
      {
        url: "https://interactive-examples.mdn.mozilla.org/media/cc0-videos/flower.mp4",
        type: "video",
      },
    ],
    text: "І невеличке відео для контексту",
  },
];

export default function MessageList() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="py-[1.6rem] space-y-[0.8rem]">
        {earlier.map((m) => (
          <MessageBubble
            key={m.id}
            text={m.text}
            time={m.time}
            isOwn={m.isOwn}
            status={m.status}
            media={m.media}
            file={m.file ?? undefined}
          />
        ))}

        <DateSeparator label="Today" />

        {today.map((m) => (
          <MessageBubble
            key={m.id}
            text={m.text}
            time={m.time}
            isOwn={m.isOwn}
            status={m.status}
            media={m.media}
            file={m.file ?? undefined}
          />
        ))}
      </div>
    </div>
  );
}
