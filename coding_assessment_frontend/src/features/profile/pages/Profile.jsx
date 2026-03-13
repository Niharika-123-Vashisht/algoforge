import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { fetchSubmissions } from "../../../services/submissionService.js";
import LoadingState from "../../../components/LoadingState.jsx";
import ErrorState from "../../../components/ErrorState.jsx";
import StatusBadge from "../../submissions/components/StatusBadge.jsx";
import { getErrorMessage } from "../../../utils/error.js";

export default function Profile() {
  const { user } = useAuth();
  const [data, setData] = useState({ results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  if (!user) {
    return <div className="text-slate-400">No profile data.</div>;
  }

  useEffect(() => {
    let active = true;
    setError("");
    fetchSubmissions()
      .then((res) => {
        if (active) setData(res);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, "Failed to load submissions."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const mySubmissions = useMemo(() => {
    return (data?.results || []).filter((s) => s.user === user.id);
  }, [data, user.id]);

  const solvedCount = useMemo(() => {
    const solved = new Set();
    mySubmissions.forEach((s) => {
      if (s.status === "accepted") solved.add(s.problem);
    });
    return solved.size;
  }, [mySubmissions]);

  const refetch = useCallback(() => {
    setLoading(true);
    setError("");
    fetchSubmissions()
      .then((res) => setData(res))
      .catch((err) => setError(getErrorMessage(err, "Failed to load submissions.")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
        <div>
          <span className="text-slate-400 text-sm">Username: </span>
          <span>{user.username}</span>
        </div>
        <div>
          <span className="text-slate-400 text-sm">Email: </span>
          <span>{user.email}</span>
        </div>
        <div>
          <span className="text-slate-400 text-sm">Name: </span>
          <span>{user.first_name} {user.last_name}</span>
        </div>
        <div>
          <span className="text-slate-400 text-sm">Bio: </span>
          <span>{user.bio || "-"}</span>
        </div>
        <div>
          <span className="text-slate-400 text-sm">Solved Problems: </span>
          <span>{solvedCount}</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Submission History</h2>
        </div>
        {loading && <LoadingState label="Loading submissions..." />}
        {!loading && error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && (
          <div className="divide-y divide-slate-800">
            {mySubmissions.map((s) => {
              const tests = s.test_results || [];
              const passed = tests.filter((t) => t.status === "accepted").length;
              const total = tests.length;
              return (
                <div key={s.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{s.problem_title}</div>
                    <div className="text-xs text-slate-400">
                      {s.language_name} • Passed {total ? `${passed}/${total}` : "—"}
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={s.status} />
                    <div className="text-xs text-slate-400 mt-1">
                      {s.time_seconds ? `${s.time_seconds}s` : "—"} • {s.memory_kb ? `${s.memory_kb} KB` : "—"}
                    </div>
                  </div>
                </div>
              );
            })}
            {mySubmissions.length === 0 && (
              <div className="py-6 text-sm text-slate-400">No submissions yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
