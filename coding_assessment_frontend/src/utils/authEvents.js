const LOGOUT_EVENT = "cap:logout";

export function triggerLogout(reason = "session_expired") {
  window.dispatchEvent(new CustomEvent(LOGOUT_EVENT, { detail: { reason } }));
}

export function onLogout(handler) {
  const listener = (event) => handler?.(event?.detail);
  window.addEventListener(LOGOUT_EVENT, listener);
  return () => window.removeEventListener(LOGOUT_EVENT, listener);
}
