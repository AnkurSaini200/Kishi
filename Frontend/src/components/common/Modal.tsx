import { useEffect, type ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Modal Surface: Classic Win98 Window */}
      <div
        className={`win98-window relative w-full ${maxWidthClasses[maxWidth]} z-10`}
      >
        {/* Title Bar */}
        <div className="win98-title-bar">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-xs">🛡️</span>
            <span id="modal-title" className="truncate">{title}</span>
          </div>
          <div className="win98-title-controls">
            <button
              onClick={onClose}
              className="win98-title-btn"
              aria-label="Close dialog"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Dialog Interior */}
        <div className="p-3 bg-[#c0c0c0]">
          {description && (
            <p className="mb-3 text-[11px] text-neutral-800 pb-2 border-b border-[#808080] border-b-[#ffffff] shadow-[0_1px_0_#ffffff]">
              {description}
            </p>
          )}
          <div className="max-h-[75vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
