export default function LoadingState({ label = "Loading..." }) {
  return (
    <div className="text-slate-300 flex items-center gap-3">
      <span className="h-5 w-5 rounded-full border-2 border-slate-600 border-t-indigo-400 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
