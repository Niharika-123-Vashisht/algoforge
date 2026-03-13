import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProblemDetail } from "../hooks/useProblemDetail.js";
import { getLanguages } from "../api/languagesApi.js";
import { runCode, submitCode } from "../../../services/submissionService.js";
import LoadingState from "../../../components/LoadingState.jsx";
import ErrorState from "../../../components/ErrorState.jsx";
import CodeEditor from "../components/CodeEditor.jsx";
import ExecutionResult from "../components/ExecutionResult.jsx";
import { getErrorMessage } from "../../../utils/error.js";
import { getBoilerplate } from "../utils/boilerplate.js";
import { triggerLeaderboardRefresh } from "../../../utils/leaderboardEvents.js";
import { useToast } from "../../../contexts/ToastContext.jsx";

const DIFFICULTY_STYLES = {
  easy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  hard: "bg-rose-500/20 text-rose-400 border-rose-500/40",
};

export default function ProblemDetailPage() {
  const { id } = useParams();
  const { problem, loading, error, refetch } = useProblemDetail(id);
  const { addToast } = useToast();
  const [languages, setLanguages] = useState([]);
  const [languageId, setLanguageId] = useState("");
  const [languageSlug, setLanguageSlug] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState(null);
  const [lastAction, setLastAction] = useState(null); // 'run' | 'submit'
  const allowedSlugs = ["python", "java", "cpp", "javascript"];

  useEffect(() => {
    let active = true;
    getLanguages()
      .then((res) => {
        const items = res?.results || res || [];
        if (!active) return;
        const filtered = items.filter((l) => allowedSlugs.includes(l.slug));
        setLanguages(filtered);
        if (filtered.length) {
          const first = filtered[0];
          setLanguageId(String(first.id));
          setLanguageSlug(first.slug);
          setSourceCode(getBoilerplate(first.slug));
        }
      })
      .catch(() => {})
      .finally(() => {});
    return () => { active = false; };
  }, []);

  const onRun = async () => {
    if (!languageId) return;
    setSubmitError("");
    setRunLoading(true);
    setResult(null);
    try {
      const submission = await runCode({
        problem: Number(id),
        language: Number(languageId),
        source_code: sourceCode,
      });
      setResult(submission);
      setLastAction("run");
      if (submission?.status === "accepted") {
        addToast("Sample test cases passed!", "success");
      } else {
        addToast("Check the output for details.", "info");
      }
    } catch (err) {
      setSubmitError(getErrorMessage(err, "Run failed."));
      addToast("Run failed.", "error");
    } finally {
      setRunLoading(false);
    }
  };

  const onSubmit = async () => {
    if (!languageId) return;
    setSubmitError("");
    setSubmitLoading(true);
    setResult(null);
    try {
      const submission = await submitCode({
        problem: Number(id),
        language: Number(languageId),
        source_code: sourceCode,
      });
      setResult(submission);
      setLastAction("submit");
      if (submission?.status === "accepted") {
        triggerLeaderboardRefresh();
        addToast("Accepted! Well done!", "success");
      } else {
        addToast("Submission completed. Check the result.", "info");
      }
    } catch (err) {
      setSubmitError(getErrorMessage(err, "Submission failed."));
      addToast("Submission failed.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const isLoading = runLoading || submitLoading;

  if (loading) {
    return <LoadingState label="Loading problem..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  if (!problem) {
    return <div className="text-slate-400">Problem not found.</div>;
  }

  const difficulty = (problem.difficulty || "easy").toLowerCase();
  const diffStyle = DIFFICULTY_STYLES[difficulty] || DIFFICULTY_STYLES.easy;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[600px]">
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 gap-4">
        {/* Left: Problem description */}
        <div className="lg:w-[45%] xl:w-[42%] flex flex-col min-h-0 border border-slate-700/60 rounded-lg bg-slate-900/50 overflow-hidden">
          <div className="flex-shrink-0 px-4 py-3 border-b border-slate-700/60 bg-slate-800/50">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-slate-100 truncate">
                {problem.title}
              </h1>
              <span
                className={`flex-shrink-0 text-xs px-2.5 py-0.5 rounded border ${diffStyle}`}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="prose prose-invert prose-sm max-w-none">
              <div className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed [&_**]:text-slate-200 [&_**]:font-medium">
                {problem.description}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/80 border border-slate-700/60 rounded-lg p-3">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                  Sample Input
                </div>
                <pre className="text-xs whitespace-pre-wrap text-slate-300 font-mono">
                  {problem.sample_input || "(empty)"}
                </pre>
              </div>
              <div className="bg-slate-950/80 border border-slate-700/60 rounded-lg p-3">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                  Sample Output
                </div>
                <pre className="text-xs whitespace-pre-wrap text-slate-300 font-mono">
                  {problem.sample_output || "(empty)"}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Editor + Output */}
        <div className="lg:flex-1 flex flex-col min-h-0 gap-4">
          <div className="flex flex-col flex-1 min-h-0 border border-slate-700/60 rounded-lg bg-slate-900/50 overflow-hidden">
            {/* Toolbar */}
            <div className="flex-shrink-0 flex flex-wrap items-center gap-2 px-4 py-2 border-b border-slate-700/60 bg-slate-800/50">
              <select
                value={languageId}
                onChange={(e) => {
                  const idValue = e.target.value;
                  setLanguageId(idValue);
                  const lang = languages.find((l) => String(l.id) === idValue);
                  const slug = lang?.slug || "";
                  setLanguageSlug(slug);
                  if (slug) setSourceCode(getBoilerplate(slug));
                }}
                className="bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                {languages.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={onRun}
                disabled={isLoading}
                className="px-4 py-1.5 rounded text-sm font-medium bg-slate-600 text-slate-200 hover:bg-slate-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {runLoading ? "Running..." : "Run"}
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={isLoading}
                className="px-4 py-1.5 rounded text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {submitLoading ? "Submitting..." : "Submit"}
              </button>
            </div>

            {/* Editor */}
            <div className="flex-1 min-h-[200px] overflow-hidden">
              <CodeEditor
                languageSlug={languageSlug}
                value={sourceCode}
                onChange={setSourceCode}
                className="h-full"
                bare
              />
            </div>

            {submitError && (
              <div className="flex-shrink-0 mx-4 mb-4 p-3 text-sm text-red-300 bg-red-600/10 border border-red-600/30 rounded-lg">
                {submitError}
              </div>
            )}

            {/* Output panel */}
            <div className="flex-shrink-0 h-48 md:h-56 border-t border-slate-700/60 p-4">
              <ExecutionResult
                submission={result}
                isSampleRun={lastAction === "run"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
