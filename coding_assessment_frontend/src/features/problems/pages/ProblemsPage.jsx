import { useState, useEffect } from "react";
import { useProblems } from "../hooks/useProblems.js";
import ProblemsTable from "../components/ProblemsTable.jsx";
import Pagination from "../components/Pagination.jsx";
import LoadingState from "../../../components/LoadingState.jsx";
import ErrorState from "../../../components/ErrorState.jsx";

const DIFFICULTY_OPTIONS = [
  { value: "", label: "All" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const TAG_OPTIONS = ["Arrays", "Strings", "Graph", "DP", "Hash Map", "Two Pointers", "Sliding Window", "Stack", "Greedy", "Binary Search", "Recursion", "Sorting", "Bit Manipulation", "Heap", "Math"];

const COMPANY_OPTIONS = ["Google", "Amazon", "Microsoft", "Meta"];

export default function ProblemsPage() {
  const [difficulty, setDifficulty] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [query, setQuery] = useState("");
  const { data, page, setPage, loading, error, refetch } = useProblems(
    1,
    difficulty,
    tagFilter || "",
    companyFilter || "",
    query
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [difficulty, tagFilter, companyFilter, query, setPage]);

  // API handles difficulty, tag, and search filtering; results are already filtered
  const filtered = data?.results || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          AlgoForge – Practice Coding Problems and Improve Your Skills
        </h1>
      </div>

      {/* Search & Filters - HackerRank style */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search problems..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Difficulty filters */}
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Difficulty
          </p>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTY_OPTIONS.map((opt) => (
              <button
                key={opt.value || "all"}
                onClick={() => setDifficulty(opt.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  difficulty === opt.value
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tag filters */}
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Tags
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTagFilter("")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                !tagFilter
                  ? "bg-slate-600 text-white"
                  : "bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
              }`}
            >
              All
            </button>
            {TAG_OPTIONS.map((tag) => (
              <button
                key={tag}
                onClick={() => setTagFilter(tagFilter === tag ? "" : tag)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  tagFilter === tag
                    ? "bg-slate-600 text-white"
                    : "bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Company filters */}
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Companies
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCompanyFilter("")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                !companyFilter
                  ? "bg-slate-600 text-white"
                  : "bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
              }`}
            >
              All
            </button>
            {COMPANY_OPTIONS.map((company) => (
              <button
                key={company}
                onClick={() => setCompanyFilter(companyFilter === company ? "" : company)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  companyFilter === company
                    ? "bg-slate-600 text-white"
                    : "bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
                }`}
              >
                {company}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && <LoadingState label="Loading problems..." />}
      {!loading && error && (
        <ErrorState message={error} onRetry={refetch} />
      )}
      {!loading && !error && (
        <>
          <ProblemsTable items={filtered} />
          {filtered.length > 0 && (
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>
                Showing {filtered.length} problem{filtered.length !== 1 ? "s" : ""}
              </span>
              {(data?.count ?? 0) > 0 && (
                <Pagination
                  page={page}
                  total={data?.count || 0}
                  onPageChange={setPage}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
