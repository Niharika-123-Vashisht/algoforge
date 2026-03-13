import { memo } from "react";
import ProblemCard from "./ProblemCard.jsx";

function ProblemsGrid({ items = [] }) {
  if (!items.length) {
    return <div className="text-slate-400">No problems found.</div>;
  }

  return (
    <div className="grid gap-4">
      {items.map((problem) => (
        <ProblemCard key={problem.id} problem={problem} />
      ))}
    </div>
  );
}

export default memo(ProblemsGrid);
