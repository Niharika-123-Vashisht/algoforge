import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSubmissions } from "../../../services/submissionService.js";
import StatusBadge from "../components/StatusBadge.jsx";
import LoadingState from "../../../components/LoadingState.jsx";
import ErrorState from "../../../components/ErrorState.jsx";
import { getErrorMessage } from "../../../utils/error.js";

export default function SubmissionList() {
  const [data, setData] = useState({ results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let mounted = true;
    setError("");
    fetchSubmissions()
      .then((res) => {
        if (mounted) setData(res);
      })
      .catch((err) => {
        if (mounted) {
          setError(getErrorMessage(err, "Failed to load submissions."));
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [refresh]);

  const refetch = useCallback(() => {
    setRefresh((v) => v + 1);
  }, []);

  if (loading) {
    return <LoadingState label="Loading submissions..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Submissions</h1>
      <div className="grid gap-3">
        {data?.results?.map((s) => (
          <Link
            key={s.id}
            to={`/submissions/${s.id}`}
            className="p-4 border border-slate-800 rounded-lg bg-slate-900 hover:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{s.problem_title}</div>
              <StatusBadge status={s.status} />
            </div>
            <div className="text-xs text-slate-400 mt-2">
              {s.username} • {s.language_name}
            </div>
          </Link>
        ))}
        {data?.results?.length === 0 && (
          <div className="text-slate-400">No submissions found.</div>
        )}
      </div>
    </div>
  );
}
