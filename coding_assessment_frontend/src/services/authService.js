import api from "../api/axios.js";
import { endpoints } from "../api/endpoints.js";
import { getRefreshToken } from "../utils/token.js";

export async function loginUser({ email, password }) {
  const { data } = await api.post(endpoints.auth.login, { email, password });
  return data;
}

export async function registerUser({ username, email, password, password_confirm }) {
  const payload = {
    username: (username || "").trim(),
    email: (email || "").trim(),
    password,
    password_confirm: password_confirm != null ? password_confirm : password
  };
  const { data } = await api.post(endpoints.auth.register, payload, {
    headers: { "Content-Type": "application/json" }
  });
  return data;
}

export async function logoutUser() {
  try {
    const refresh = getRefreshToken();
    await api.post(endpoints.auth.logout, { refresh: refresh || undefined });
  } catch {
    // Ignore logout API errors - we clear tokens locally anyway
  }
}

export async function getProfile() {
  const { data } = await api.get(endpoints.auth.profile);
  return data;
}

export async function googleLogin(idToken) {
  const { data } = await api.post(endpoints.auth.google, { id_token: idToken });
  return data;
}
