import api from "../../../api/axios.js";
import { endpoints } from "../../../api/endpoints.js";

export async function getLanguages() {
  const { data } = await api.get(endpoints.languages);
  return data;
}
