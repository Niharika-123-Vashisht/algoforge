import { useGlobalError } from "../contexts/ErrorContext.jsx";

export default function GlobalError() {
  const { error, clearError } = useGlobalError();

  if (!error) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm rounded-md bg-red-600/90 text-white shadow-lg">
      <div className="p-4 flex items-start gap-3">
        <div className="flex-1 text-sm">{error}</div>
        <button
          onClick={clearError}
          className="text-white/80 hover:text-white"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}
