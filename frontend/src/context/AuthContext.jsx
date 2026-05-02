import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);    // null = unknown, false = guest, object = signed in
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("cently_customer_token");
    if (!token) { setUser(false); setLoading(false); return; }
    api.get("/account/me")
      .then((r) => setUser(r.data))
      .catch(() => { localStorage.removeItem("cently_customer_token"); setUser(false); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    if (data.user.role !== "customer") {
      // Allow admin to sign in to customer area too (acts as customer)
      // But for cleanliness, store as customer token if explicit customer page used
    }
    localStorage.setItem("cently_customer_token", data.access_token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("cently_customer_token", data.access_token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("cently_customer_token");
    setUser(false);
  };

  const refresh = async () => {
    try {
      const { data } = await api.get("/account/me");
      setUser(data);
      return data;
    } catch {
      logout();
    }
  };

  const updateProfile = async (payload) => {
    const { data } = await api.patch("/account/me", payload);
    setUser(data);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
