import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useMediaViewer } from '../../store/useMediaViewer';

export default function MediaViewerOverlay() {
  const { isOpen, items, index, close, next, prev, onDelete } = useMediaViewer();

  // Call hooks on every render; guard internally
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, close, next, prev]);

  if (!isOpen || !items.length) return null;

  const item = items[index];
  const canPrev = index > 0;
  const canNext = index < items.length - 1;

  return (
    <div className="fixed inset-0 z-[1000]">
      <div className="absolute inset-0 bg-black/80" onClick={close} />

      <div className="relative z-10 h-full w-full flex items-center justify-center select-none">

        {canPrev && (
          <div className="absolute inset-y-0 left-0 w-[20%] group/left" onClick={prev}>
            <button
              className="absolute left-[2rem] top-1/2 -translate-y-1/2 opacity-0 group-hover/left:opacity-100
                         p-[0.8rem] rounded-full bg-black/40 hover:bg-black/60"
              aria-label="Previous"
            >
              <Icon icon="solar:alt-arrow-left-linear" className="w-[2.4rem] h-[2.4rem] text-white" />
            </button>
          </div>
        )}

        {canNext && (
          <div className="absolute inset-y-0 right-0 w-[20%] group/right" onClick={next}>
            <button
              className="absolute right-[2rem] top-1/2 -translate-y-1/2 opacity-0 group-hover/right:opacity-100
                         p-[0.8rem] rounded-full bg-black/40 hover:bg-black/60"
              aria-label="Next"
            >
              <Icon icon="solar:alt-arrow-right-linear" className="w-[2.4rem] h-[2.4rem] text-white" />
            </button>
          </div>
        )}

        <div className="">
          {item.type === "image" ? (
              <img
                src={item.url}
                alt=""
                className="
                  block w-auto h-auto object-contain rounded-[0.8rem] shadow-2xl
                  /* minimum size so it never looks tiny */
                  min-w-[40rem] min-h-[28rem]
                  sm:min-w-[55vw] sm:min-h-[45vh]
                  /* maximum size so it never overflows */
                  max-w-[min(96vw,1400px)] max-h-[min(92vh,90rem)]
                "
              />
            ) : (
              <video
                src={item.url}
                controls
                autoPlay
                className="
                  block w-auto h-auto object-contain rounded-[0.8rem] shadow-2xl
                  min-w-[40rem] min-h-[28rem]
                  sm:min-w-[55vw] sm:min-h-[45vh]
                  max-w-[min(96vw,1400px)] max-h-[min(92vh,90rem)]
                "
              />
            )}
        </div>

        <div className="absolute top-[1.6rem] right-[1.6rem] flex items-center gap-[0.8rem]">
          <a
            href={item.url}
            download={item.filename}
            className="p-[0.8rem] rounded-full bg-black/40 hover:bg-black/60"
            aria-label="Download"
          >
            <Icon icon="solar:download-linear" className="w-[2.2rem] h-[2.2rem] text-white" />
          </a>
          <button
            onClick={() => onDelete?.(item)}
            className="p-[0.8rem] rounded-full bg-black/40 hover:bg-black/60"
            aria-label="Delete"
          >
            <Icon icon="solar:trash-bin-trash-linear" className="w-[2.2rem] h-[2.2rem] text-red-400" />
          </button>
          <button
            onClick={close}
            className="p-[0.8rem] rounded-full bg-black/40 hover:bg-black/60"
            aria-label="Close"
          >
            <Icon icon="ph:x-bold" className="w-[2.2rem] h-[2.2rem] text-white" />
          </button>
        </div>

        <div className="absolute bottom-[1.2rem] right-[1.6rem] text-white/80 text-[1.2rem]">
          {index + 1} / {items.length}
        </div>
      </div>
    </div>
  );
}
