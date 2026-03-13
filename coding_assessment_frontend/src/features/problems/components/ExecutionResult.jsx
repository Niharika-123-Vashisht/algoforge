import StatusBadge from "../../submissions/components/StatusBadge.jsx";

const VERDICT_STYLES = {
  accepted: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
  wrong_answer: "bg-red-500/15 border-red-500/40 text-red-400",
  runtime_error: "bg-red-500/15 border-red-500/40 text-red-400",
  time_limit: "bg-amber-500/15 border-amber-500/40 text-amber-400",
  memory_limit: "bg-amber-500/15 border-amber-500/40 text-amber-400",
  compile_error: "bg-rose-500/15 border-rose-500/40 text-rose-400",
  internal_error: "bg-rose-500/15 border-rose-500/40 text-rose-400",
  pending: "bg-slate-500/15 border-slate-500/40 text-slate-400",
  running: "bg-sky-500/15 border-sky-500/40 text-sky-400",
};

const VERDICT_LABELS = {
  accepted: "Accepted",
  wrong_answer: "Wrong Answer",
  runtime_error: "Runtime Error",
  time_limit: "Time Limit Exceeded",
  memory_limit: "Memory Limit Exceeded",
  compile_error: "Compile Error",
  internal_error: "Internal Error",
  pending: "Pending",
  running: "Running",
};

export default function ExecutionResult({ submission, isSampleRun }) {
  if (!submission) {
    return (
      <div className="h-full flex flex-col bg-slate-900/80 border border-slate-700/60 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-700/60 bg-slate-800/50">
          <span className="text-sm font-medium text-slate-400">
            {isSampleRun ? "Sample Test Case Output" : "Submission Result"}
          </span>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <p className="text-sm text-slate-500">
            Run your code to see output here.
          </p>
        </div>
      </div>
    );
  }

  const status = submission.status || "pending";
  const verdictStyle = VERDICT_STYLES[status] || VERDICT_STYLES.pending;
  const verdictLabel = VERDICT_LABELS[status] || status;
  const tests = submission.test_results || [];
  const passed = tests.filter((t) => t.status === "accepted").length;
  const total = tests.length;
  const isAccepted = status === "accepted";

  return (
    <div className="h-full flex flex-col bg-slate-900/80 border border-slate-700/60 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/60 bg-slate-800/50 space-y-2">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-slate-400">
            {isSampleRun ? "Sample Test Case Output" : "Submission Result"}
          </span>
          <StatusBadge status={status} />
        </div>
        {total > 0 && (
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>
              Passed: {passed}/{total} test case{total !== 1 ? "s" : ""}
            </span>
            {submission.time_seconds != null && (
              <span>Time: {submission.time_seconds}s</span>
            )}
            {submission.memory_kb != null && (
              <span>Memory: {submission.memory_kb} KB</span>
            )}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Result feedback message panel */}
        <div
          className={`rounded-xl p-5 text-center transition-all duration-300 ${
            isAccepted
              ? "bg-emerald-600/25 border-2 border-emerald-500/50 text-emerald-100 shadow-lg shadow-emerald-500/10"
              : "bg-red-600/20 border-2 border-red-500/50 text-red-100 shadow-lg shadow-red-500/10"
          }`}
        >
          {isAccepted ? (
            <>
              <div className="text-2xl mb-2">🎉</div>
              <div className="font-semibold text-lg text-emerald-200 mb-2">
                Congratulations!
              </div>
              <p className="text-sm text-emerald-100/90 leading-relaxed">
                You solved this problem successfully on AlgoForge.
                Your logic and coding skills are improving. Keep going and solve more challenges!
              </p>
            </>
          ) : (
            <>
              <div className="text-2xl mb-2">❌</div>
              <div className="font-semibold text-lg text-red-200 mb-2">
                Not Quite Right
              </div>
              <p className="text-sm text-red-100/90 leading-relaxed">
                Your solution did not pass all test cases.
                Don&apos;t worry — review your logic and try again.
                Every mistake is a step closer to mastery. Keep coding!
              </p>
            </>
          )}
        </div>
        {submission.compile_output && (
          <div>
            <div className="text-xs font-medium text-amber-400/90 mb-1">
              Compile Output
            </div>
            <pre className="text-xs whitespace-pre-wrap text-amber-300/90 bg-slate-950/80 p-3 rounded border border-slate-700/60 overflow-x-auto">
              {submission.compile_output}
            </pre>
          </div>
        )}
        {submission.stderr && (
          <div>
            <div className="text-xs font-medium text-red-400/90 mb-1">
              Error
            </div>
            <pre className="text-xs whitespace-pre-wrap text-red-300/90 bg-slate-950/80 p-3 rounded border border-slate-700/60 overflow-x-auto">
              {submission.stderr}
            </pre>
          </div>
        )}
        {tests.length > 0 && (
          <div className="space-y-3">
            {tests.map((tc, i) => (
              <div
                key={i}
                className="bg-slate-950/80 border border-slate-700/60 rounded p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    Test case {i + 1}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      tc.status === "accepted"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {tc.status === "accepted" ? "Passed" : "Failed"}
                  </span>
                </div>
                {tc.input && (
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">Input</div>
                    <pre className="text-xs whitespace-pre-wrap text-slate-300 bg-slate-900/50 p-2 rounded">
                      {tc.input || "(empty)"}
                    </pre>
                  </div>
                )}
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">
                    Expected Output
                  </div>
                  <pre className="text-xs whitespace-pre-wrap text-slate-300 bg-slate-900/50 p-2 rounded">
                    {tc.expected_output || "(empty)"}
                  </pre>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">
                    Your Output
                  </div>
                  <pre className="text-xs whitespace-pre-wrap text-slate-300 bg-slate-900/50 p-2 rounded">
                    {tc.stdout ?? "(no output)"}
                  </pre>
                </div>
                {tc.stderr && (
                  <div>
                    <div className="text-xs text-red-400/90 mb-0.5">Stderr</div>
                    <pre className="text-xs whitespace-pre-wrap text-red-300/90 bg-slate-900/50 p-2 rounded">
                      {tc.stderr}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {!tests.length && submission.stdout && (
          <div>
            <div className="text-xs font-medium text-slate-400 mb-1">Output</div>
            <pre className="text-xs whitespace-pre-wrap text-slate-300 bg-slate-950/80 p-3 rounded border border-slate-700/60 overflow-x-auto">
              {submission.stdout}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
