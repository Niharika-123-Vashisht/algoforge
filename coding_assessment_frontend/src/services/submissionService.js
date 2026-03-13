import api from "../api/axios.js";
import { endpoints } from "../api/endpoints.js";

export async function fetchSubmissions() {
  const { data } = await api.get(endpoints.submissions);
  return data;
}

export async function fetchSubmissionById(id) {
  const { data } = await api.get(`${endpoints.submissions}${id}/`);
  return data;
}

export async function createSubmission(payload) {
  const { data } = await api.post(endpoints.submissions, payload);
  return data;
}

export async function runCode(payload) {
  return createSubmission({ ...payload, run_sample_only: true });
}

export async function submitCode(payload) {
  return createSubmission({ ...payload, run_sample_only: false });
}
