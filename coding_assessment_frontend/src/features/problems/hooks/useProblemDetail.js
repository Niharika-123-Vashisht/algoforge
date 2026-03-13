import { useCallback, useEffect, useState } from "react";
import { getProblem } from "../api/problemsApi.js";
import { getErrorMessage } from "../../../utils/error.js";

export function useProblemDetail(problemId) {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!problemId) return;
    let active = true;
    setLoading(true);
    setError("");

    getProblem(problemId)
      .then((res) => {
        if (active) setProblem(res);
      })
      .catch((err) => {
        if (active) {
          setError(getErrorMessage(err, "Failed to load problem."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [problemId, refresh]);

  const refetch = useCallback(() => {
    setRefresh((v) => v + 1);
  }, []);

  return { problem, loading, error, refetch };
}
