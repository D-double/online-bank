import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface BottomSheetProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

/** На мобильных выезжает снизу, на широких экранах отображается как модальное окно по центру. */
export const BottomSheet = ({ open, title, onClose, children }: BottomSheetProps) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 animate-fade-in bg-slate-900/50" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full animate-slide-up overflow-y-auto rounded-t-3xl bg-surface p-5 pb-8 sm:max-w-md sm:animate-pop sm:rounded-3xl sm:pb-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full bg-surface-strong text-muted hover:bg-line"
            aria-label="close"
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
};
