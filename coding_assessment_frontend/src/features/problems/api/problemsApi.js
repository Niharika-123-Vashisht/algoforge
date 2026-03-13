import api from "../../../api/axios.js";
import { endpoints } from "../../../api/endpoints.js";

export async function getProblems({ page = 1, difficulty, tag, company, search } = {}) {
  const params = { page };
  if (difficulty) params.difficulty = difficulty;
  if (tag) params.tag = tag;
  if (company) params.company = company;
  if (search && search.trim()) params.search = search.trim();
  const { data } = await api.get(endpoints.problems, { params });
  return data;
}

export async function getProblem(id) {
  const { data } = await api.get(`${endpoints.problems}${id}/`);
  return data;
}
