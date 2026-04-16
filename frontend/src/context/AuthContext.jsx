import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchJson, loginApi, registerApi } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      fetchJson("/auth/me")
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          setToken(null);
          setUser(null);
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    setToken(data.access_token);
  };

  const register = async (email, password) => {
    const data = await registerApi(email, password);
    // After returning the user, we just login
    await login(email, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const updateUserLocal = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout, updateUserLocal, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
