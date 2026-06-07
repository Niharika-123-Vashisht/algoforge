import api from "../../../api/axios.js";
import { endpoints } from "../../../api/endpoints.js";

export async function fetchLeaderboard() {
  const { data } = await api.get(endpoints.leaderboard);
  const entries = Array.isArray(data) ? data : data?.results || [];
  console.log("[LEADERBOARD] API response:", entries);
  return { results: entries, raw: data };
}
