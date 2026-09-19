export interface ToastProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 win98-window shadow-xl max-w-sm"
    >
      <div className="win98-title-bar py-0.5 px-1.5">
        <span className="text-[10px] font-bold">Kishi Security Notification</span>
        <button
          onClick={onClose}
          className="win98-title-btn !w-3.5 !h-3 text-[8px]"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
      <div className="p-2.5 bg-[#ffffe1] text-black text-[11px] flex items-center gap-2">
        <span className="text-sm">ℹ️</span>
        <div className="flex-1">{message}</div>
      </div>
    </div>
  );
}
