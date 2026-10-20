//src/context/UseContext.jsx
/* eslint-disable react-refresh/only-export-components */

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { api, setToken } from "../api";

export const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // restoring session on first load
  const started = useRef(false);

  // Restore the session (cookie or stored token) when the app loads.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    // Works with either the cookie or the stored token.
    api("/api/user/me")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Any 401 from the API means the session is gone.
  useEffect(() => {
    const onUnauthorized = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener("auth:unauthorized", onUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", onUnauthorized);
  }, []);

  const login = useCallback(async (identifier, password) => {
    const data = await api("/api/auth/login", {
      method: "POST",
      body: { email: identifier, password },
    });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (form) => {
    await api("/api/user", { method: "POST", body: form });
    return login(form.email, form.password);
  }, [login]);

  const logout = useCallback(async () => {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } catch {
      /* already logged out */
    }
    setToken(null);
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}
