import { memo } from "react";

function Pagination({ page, total, pageSize = 20, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  if (total <= pageSize) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-t border-slate-800 pt-4">
      <div className="text-xs text-slate-400">
        Page {page} of {totalPages}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          className="px-3 py-1.5 rounded bg-slate-800 text-sm disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          className="px-3 py-1.5 rounded bg-slate-800 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default memo(Pagination);
