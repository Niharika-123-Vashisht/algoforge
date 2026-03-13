const LEADERBOARD_REFRESH = "cap:leaderboard:refresh";

export function triggerLeaderboardRefresh() {
  window.dispatchEvent(new Event(LEADERBOARD_REFRESH));
}

export function onLeaderboardRefresh(handler) {
  window.addEventListener(LEADERBOARD_REFRESH, handler);
  return () => window.removeEventListener(LEADERBOARD_REFRESH, handler);
}
