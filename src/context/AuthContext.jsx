import React, { createContext, useState, useEffect } from "react";
import { login as apiLogin, signup as apiSignup } from "../api/auth";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUser({ token });
  }, []);

  const login = async (email, password) => {
    const resp = await apiLogin(email, password);
    localStorage.setItem("token", resp.token);
    setUser({ token: resp.token });
    navigate("/");
  };

  const signup = async (name, email, password) => {
    await apiSignup(name, email, password);
    // after signup, auto-login
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
