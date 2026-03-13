const STATUS_STYLES = {
  accepted: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  wrong_answer: "bg-red-500/20 text-red-300 border-red-500/30",
  time_limit: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  memory_limit: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  runtime_error: "bg-red-500/20 text-red-300 border-red-500/30",
  compile_error: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  internal_error: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  pending: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  running: "bg-sky-500/20 text-sky-300 border-sky-500/30"
};

const STATUS_LABELS = {
  accepted: "Accepted",
  wrong_answer: "Wrong Answer",
  time_limit: "Time Limit Exceeded",
  memory_limit: "Memory Limit Exceeded",
  runtime_error: "Runtime Error",
  compile_error: "Compile Error",
  internal_error: "Internal Error",
  pending: "Pending",
  running: "Running"
};

export default function StatusBadge({ status }) {
  const key = status || "pending";
  const cls = STATUS_STYLES[key] || STATUS_STYLES.pending;
  const label = STATUS_LABELS[key] || status;

  return (
    <span
      className={`text-xs px-2 py-1 rounded border ${cls}`}
      title={label}
    >
      {label}
    </span>
  );
}
