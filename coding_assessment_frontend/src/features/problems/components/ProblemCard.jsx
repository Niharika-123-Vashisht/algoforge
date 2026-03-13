import { memo } from "react";
import { Link } from "react-router-dom";

const DIFFICULTY_STYLES = {
  easy: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  medium: "bg-amber-500/15 text-amber-300 border-amber-400/30",
  hard: "bg-red-500/15 text-red-300 border-red-400/30"
};

function ProblemCard({ problem }) {
  const difficulty = problem.difficulty || "easy";
  const badgeClass = DIFFICULTY_STYLES[difficulty] || DIFFICULTY_STYLES.easy;
  return (
    <Link
      to={`/problems/${problem.id}`}
      className="p-5 border border-slate-800 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 transition-colors shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="font-semibold text-slate-100">{problem.title}</div>
        <span className={`text-xs px-2.5 py-1 rounded border ${badgeClass}`}>
          {difficulty}
        </span>
      </div>
      <div className="text-xs text-slate-400 mt-2">
        Created by {problem.created_by_username || "Unknown"}
      </div>
    </Link>
  );
}

export default memo(ProblemCard);
