import { useToast } from "../contexts/ToastContext.jsx";

const TYPE_STYLES = {
  success: "bg-emerald-500/90 border-emerald-300/30",
  error: "bg-red-500/90 border-red-300/30",
  info: "bg-indigo-500/90 border-indigo-300/30"
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed top-5 right-5 z-50 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`max-w-sm rounded-md border px-4 py-3 text-sm text-white shadow-lg ${TYPE_STYLES[t.type] || TYPE_STYLES.info}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">{t.message}</div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-white/80 hover:text-white"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
