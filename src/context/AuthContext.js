import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const LS_KEY = "ii_admin_auth";

const USERNAME = process.env.REACT_APP_ADMIN_USERNAME || "admin";
const PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || "admin123";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      setIsAdmin(raw === "true");
    } catch {
      setIsAdmin(false);
    }
  }, []);

  const login = useCallback((username, password) => {
    const ok = username === USERNAME && password === PASSWORD;
    if (ok) {
      setIsAdmin(true);
      try {
        localStorage.setItem(LS_KEY, "true");
      } catch {
        // ignore
      }
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(() => ({ isAdmin, login, logout }), [isAdmin, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

