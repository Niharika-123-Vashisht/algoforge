import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSubmissionById } from "../../../services/submissionService.js";
import StatusBadge from "../components/StatusBadge.jsx";
import ResultCard from "../components/ResultCard.jsx";
import LoadingState from "../../../components/LoadingState.jsx";
import ErrorState from "../../../components/ErrorState.jsx";
import { getErrorMessage } from "../../../utils/error.js";

export default function SubmissionDetail() {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let mounted = true;
    setError("");
    fetchSubmissionById(id)
      .then((res) => {
        if (mounted) setSubmission(res);
      })
      .catch((err) => {
        if (mounted) {
          setError(getErrorMessage(err, "Failed to load submission."));
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id, refresh]);

  const refetch = useCallback(() => {
    setRefresh((v) => v + 1);
  }, []);

  if (loading) {
    return <LoadingState label="Loading submission..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  if (!submission) {
    return <div className="text-slate-400">Submission not found.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{submission.problem_title}</h1>
          <div className="text-sm text-slate-400">
            {submission.username} • {submission.language_name}
          </div>
        </div>
        <StatusBadge status={submission.status} />
      </div>
      <ResultCard submission={submission} />
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="text-sm text-slate-400 mb-2">Source Code</div>
        <pre className="text-xs whitespace-pre-wrap">{submission.source_code}</pre>
      </div>
    </div>
  );
}
