let globalErrorHandler = null;

export function setGlobalErrorHandler(handler) {
  globalErrorHandler = handler;
}

function firstFieldError(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return null;
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (Array.isArray(val) && val.length) return String(val[0]);
    if (typeof val === "string") return val;
    if (typeof val === "object" && val !== null) {
      const nested = firstFieldError(val);
      if (nested) return nested;
    }
  }
  return null;
}

export function getErrorMessage(error, fallback = "An unexpected error occurred.") {
  const data = error?.response?.data;
  // Backend custom handler: { error: "...", detail: { ... } }
  if (typeof data?.error === "string" && data.error.trim()) return data.error;
  if (typeof data?.detail === "string") return data.detail;
  // Raw DRF validation body: { field: ["msg"] }
  const fromDetail = firstFieldError(data?.detail) || firstFieldError(data);
  if (fromDetail) return fromDetail;
  if (error?.response?.status === 0 || !error?.response) {
    return "Network error — is the backend running?";
  }
  return error?.message || fallback;
}

export function handleApiError(error) {
  const message = getErrorMessage(error);

  if (globalErrorHandler) {
    globalErrorHandler(message);
  }

  return Promise.reject(error);
}
