import { Icon } from "@iconify/react";
import { useMediaViewer, type MediaItem } from "../../../store/useMediaViewer";
import { useViewerHotkeys } from "./hooks/useViewerHotkeys";
import { useBodyScrollLock } from "./hooks/useBodyScrollLock";
import NavZone from "./components/NavZone";
import MediaContent from "./components/MediaContent";
import TopBar from "./components/TopBar";
import Counter from "./components/Counter";

export default function MediaViewerOverlay() {
  const { isOpen, items, index, close, next, prev, onDelete } = useMediaViewer();

  useViewerHotkeys(isOpen, { close, next, prev });
  useBodyScrollLock(isOpen);

  if (!isOpen || !items.length) return null;

  const item = items[index];
  const canPrev = index > 0;
  const canNext = index < items.length - 1;

  return (
    <div className="fixed inset-0 z-[1000]">
      <div className="absolute inset-0 bg-black/80" onClick={close} />

      <div className="relative z-10 h-full w-full flex items-center justify-center select-none">
        {canPrev && (
          <NavZone side="left" onClick={prev} ariaLabel="Previous">
            <Icon icon="solar:alt-arrow-left-linear" className="w-[2.4rem] h-[2.4rem] text-white" />
          </NavZone>
        )}

        {canNext && (
          <NavZone side="right" onClick={next} ariaLabel="Next">
            <Icon icon="solar:alt-arrow-right-linear" className="w-[2.4rem] h-[2.4rem] text-white" />
          </NavZone>
        )}

        <MediaContent item={item} />

        <TopBar
          url={item.url}
          filename={("filename" in item && item.filename) ? (item as MediaItem).filename : undefined}
          onDelete={onDelete ? () => onDelete(item) : undefined}
          onClose={close}
        />

        <Counter current={index + 1} total={items.length} />
      </div>
    </div>
  );
}
