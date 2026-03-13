import StatusBadge from "./StatusBadge.jsx";

export default function ResultCard({ submission }) {
  const time = submission?.time_seconds;
  const memory = submission?.memory_kb;
  const tests = submission?.test_results || [];
  const passed = tests.filter((t) => t.status === "accepted").length;
  const total = tests.length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-400">Result</div>
        <StatusBadge status={submission.status} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-slate-950 border border-slate-800 rounded p-3">
          <div className="text-xs text-slate-400">Passed</div>
          <div>{total ? `${passed}/${total}` : "—"}</div>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded p-3">
          <div className="text-xs text-slate-400">Time</div>
          <div>{time ? `${time}s` : "—"}</div>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded p-3">
          <div className="text-xs text-slate-400">Memory</div>
          <div>{memory ? `${memory} KB` : "—"}</div>
        </div>
      </div>
      {submission.compile_output && (
        <div className="bg-slate-950 border border-slate-800 rounded p-3">
          <div className="text-xs text-slate-400 mb-1">Compile Output</div>
          <pre className="text-xs whitespace-pre-wrap text-amber-300">
            {submission.compile_output}
          </pre>
        </div>
      )}
      {submission.stdout && (
        <div className="bg-slate-950 border border-slate-800 rounded p-3">
          <div className="text-xs text-slate-400 mb-1">Stdout</div>
          <pre className="text-xs whitespace-pre-wrap">{submission.stdout}</pre>
        </div>
      )}
      {submission.stderr && (
        <div className="bg-slate-950 border border-slate-800 rounded p-3">
          <div className="text-xs text-slate-400 mb-1">Stderr</div>
          <pre className="text-xs whitespace-pre-wrap text-red-300">
            {submission.stderr}
          </pre>
        </div>
      )}
    </div>
  );
}
