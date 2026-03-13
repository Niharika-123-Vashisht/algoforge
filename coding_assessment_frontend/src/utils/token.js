const ACCESS_KEY = "cap_access_token";
const REFRESH_KEY = "cap_refresh_token";
const storage = localStorage;

export function setTokens(access, refresh) {
  if (access) storage.setItem(ACCESS_KEY, access);
  if (refresh) storage.setItem(REFRESH_KEY, refresh);
}

export function getAccessToken() {
  return storage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return storage.getItem(REFRESH_KEY);
}

export function clearTokens() {
  storage.removeItem(ACCESS_KEY);
  storage.removeItem(REFRESH_KEY);
}

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  if (!token) return true;
  const payload = parseJwt(token);
  if (!payload?.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

export function getTokenExpiry(token) {
  const payload = parseJwt(token);
  if (!payload?.exp) return null;
  return payload.exp * 1000;
}
