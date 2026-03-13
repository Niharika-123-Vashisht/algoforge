import api from "../../../api/axios.js";
import { endpoints } from "../../../api/endpoints.js";

export async function fetchLeaderboard() {
  const { data } = await api.get(endpoints.leaderboard);
  return data;
}
