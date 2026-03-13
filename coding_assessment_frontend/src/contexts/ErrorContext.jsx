import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setGlobalErrorHandler } from "../utils/error.js";

const ErrorContext = createContext(null);

export function ErrorProvider({ children }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    setGlobalErrorHandler((message) => setError(message));
  }, []);

  const clearError = () => setError(null);

  const value = useMemo(
    () => ({ error, setError, clearError }),
    [error]
  );

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
}

export function useGlobalError() {
  const ctx = useContext(ErrorContext);
  if (!ctx) {
    throw new Error("useGlobalError must be used within ErrorProvider");
  }
  return ctx;
}
