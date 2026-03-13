import { useCallback, useEffect, useState } from "react";
import { getProblems } from "../api/problemsApi.js";
import { getErrorMessage } from "../../../utils/error.js";

export function useProblems(initialPage = 1, difficulty = "", tag = "", company = "", search = "") {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState({ results: [], count: 0, next: null, previous: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getProblems({
      page,
      difficulty: difficulty || undefined,
      tag: tag || undefined,
      company: company || undefined,
      search: search || undefined
    })
      .then((res) => {
        if (active) setData(res);
      })
      .catch((err) => {
        if (active) {
          setError(getErrorMessage(err, "Failed to load problems."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, difficulty, tag, company, search, refresh]);

  const refetch = useCallback(() => {
    setRefresh((v) => v + 1);
  }, []);

  return {
    data,
    page,
    setPage,
    loading,
    error,
    refetch
  };
}
