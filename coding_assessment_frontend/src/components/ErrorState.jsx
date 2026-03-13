export default function ErrorState({ message, onRetry }) {
  return (
    <div className="border border-red-600/30 bg-red-600/10 rounded-lg p-4 text-red-300">
      <div className="text-sm">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-3 py-1.5 rounded bg-red-600/20 hover:bg-red-600/30 text-sm"
        >
          Retry
        </button>
      )}
    </div>
  );
}
