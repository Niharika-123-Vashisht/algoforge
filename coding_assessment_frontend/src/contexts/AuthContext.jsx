import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { loginUser, registerUser, getProfile, logoutUser } from "../services/authService.js";
import { getAccessToken, setTokens, clearTokens, isTokenExpired, getTokenExpiry } from "../utils/token.js";
import { onLogout } from "../utils/authEvents.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const logoutTimer = useRef(null);

  const clearLogoutTimer = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
  };

  const scheduleAutoLogout = (token) => {
    clearLogoutTimer();
    const expiryMs = getTokenExpiry(token);
    if (!expiryMs) return;
    const delay = Math.max(expiryMs - Date.now(), 0);
    logoutTimer.current = setTimeout(() => {
      clearTokens();
      setUser(null);
    }, delay);
  };

  const loadUser = async () => {
    const token = getAccessToken();
    if (!token || isTokenExpired(token)) {
      clearTokens();
      setUser(null);
      setIsLoading(false);
      return;
    }
    scheduleAutoLogout(token);
    try {
      const data = await getProfile();
      setUser(data);
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    const unsubscribe = onLogout(() => {
      clearTokens();
      setUser(null);
    });
    return () => {
      unsubscribe();
      clearLogoutTimer();
    };
  }, []);

  const login = async ({ email, password }) => {
    const data = await loginUser({ email, password });
    const token = data.token || data.access;
    setTokens(token, data.refresh);
    scheduleAutoLogout(token);
    setUser(data.user || await getProfile());
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    const token = data.token || data.tokens?.access;
    if (token) {
      setTokens(token, data.refresh || data.tokens?.refresh);
      scheduleAutoLogout(token);
      setUser(data.user);
    }
  };

  const logout = async () => {
    clearLogoutTimer();
    await logoutUser();
    clearTokens();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated: !!user && !isTokenExpired(getAccessToken())
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
