import api from "../api/axios.js";
import { endpoints } from "../api/endpoints.js";

export async function fetchProblems() {
  const { data } = await api.get(endpoints.problems);
  return data;
}

export async function fetchProblemById(id) {
  const { data } = await api.get(`${endpoints.problems}${id}/`);
  return data;
}
