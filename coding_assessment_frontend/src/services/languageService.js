import api from "../api/axios.js";
import { endpoints } from "../api/endpoints.js";

export async function fetchLanguages() {
  const { data } = await api.get(endpoints.languages);
  return data;
}
