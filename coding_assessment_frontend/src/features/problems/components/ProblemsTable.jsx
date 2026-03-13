import { memo } from "react";
import { Link } from "react-router-dom";

const DIFFICULTY_STYLES = {
  easy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  hard: "bg-rose-500/20 text-rose-400 border-rose-500/40",
};

function DifficultyBadge({ difficulty }) {
  const d = (difficulty || "easy").toLowerCase();
  const style = DIFFICULTY_STYLES[d] || DIFFICULTY_STYLES.easy;
  const label = d.charAt(0).toUpperCase() + d.slice(1);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border ${style}`}
    >
      {label}
    </span>
  );
}

function TagBadge({ tag }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-slate-700/80 text-slate-300 border border-slate-600/50">
      {tag}
    </span>
  );
}

function CompanyBadge({ company }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
      {company}
    </span>
  );
}

function ProblemsTable({ items = [] }) {
  if (!items.length) {
    return (
      <div className="text-center py-12 text-slate-400">
        No problems found. Try adjusting your search or filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700/60 bg-slate-900/50">
      <table className="min-w-full divide-y divide-slate-700/60">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
            >
              Problem Name
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
            >
              Difficulty
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
            >
              Success Rate
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
            >
              Tags
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
            >
              Companies
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/60">
          {items.map((problem) => {
            const tags = problem.tags || [];
            const companies = problem.companies || [];
            return (
              <tr
                key={problem.id}
                className="hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <Link
                    to={`/problems/${problem.id}`}
                    className="text-slate-100 font-medium hover:text-cyan-400 transition-colors"
                  >
                    {problem.title}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <DifficultyBadge difficulty={problem.difficulty} />
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">
                  {problem.success_rate != null
                    ? `${problem.success_rate}%`
                    : "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <TagBadge key={tag} tag={tag} />
                    ))}
                    {tags.length === 0 && (
                      <span className="text-slate-500 text-sm">—</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {companies.map((company) => (
                      <CompanyBadge key={company} company={company} />
                    ))}
                    {companies.length === 0 && (
                      <span className="text-slate-500 text-sm">—</span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default memo(ProblemsTable);
