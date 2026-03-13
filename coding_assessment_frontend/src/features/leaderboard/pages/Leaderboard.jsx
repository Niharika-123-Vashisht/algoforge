import { useCallback, useEffect, useState } from "react";
import { fetchLeaderboard } from "../api/leaderboardApi.js";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import LoadingState from "../../../components/LoadingState.jsx";
import ErrorState from "../../../components/ErrorState.jsx";
import { getErrorMessage } from "../../../utils/error.js";
import { onLeaderboardRefresh } from "../../../utils/leaderboardEvents.js";

export default function Leaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLeaderboard = useCallback(() => {
    let active = true;
    setError("");
    setLoading(true);
    fetchLeaderboard()
      .then((res) => {
        if (active) {
          const items = res?.results || res || [];
          setEntries(items);
        }
      })
      .catch((err) => {
        if (active) {
          setError(getErrorMessage(err, "Failed to load leaderboard."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const cleanup = loadLeaderboard();
    const unsubscribe = onLeaderboardRefresh(() => loadLeaderboard());
    return () => {
      cleanup?.();
      unsubscribe();
    };
  }, [loadLeaderboard]);

  if (loading) {
    return <LoadingState label="Loading leaderboard..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Leaderboard</h1>
        <button
          type="button"
          onClick={loadLeaderboard}
          className="px-3 py-2 rounded bg-slate-800 text-sm hover:bg-slate-700"
        >
          Refresh
        </button>
      </div>
      <div className="border border-slate-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 bg-slate-900 text-xs uppercase text-slate-400 px-4 py-3">
          <div className="col-span-2">Rank</div>
          <div className="col-span-7">User</div>
          <div className="col-span-3 text-right">Points</div>
        </div>
        <div className="divide-y divide-slate-800">
          {entries.map((entry, index) => {
            const isCurrent = user?.id === entry.id;
            return (
              <div
                key={entry.id}
                className={`grid grid-cols-12 px-4 py-3 text-sm ${
                  isCurrent ? "bg-indigo-600/10" : "bg-slate-950"
                }`}
              >
                <div className="col-span-2 font-medium">#{index + 1}</div>
                <div className="col-span-7">
                  <div className="font-medium">{entry.username}</div>
                  <div className="text-xs text-slate-400">
                    {entry.first_name} {entry.last_name}
                  </div>
                </div>
                <div className="col-span-3 text-right font-semibold">
                  {entry.points}
                </div>
              </div>
            );
          })}
          {entries.length === 0 && (
            <div className="px-4 py-6 text-sm text-slate-400">
              No leaderboard data.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
