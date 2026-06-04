// src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

// ── State Shape ───────────────────────────────────────────
const initialState = {
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: true,
};

// ── Reducer ───────────────────────────────────────────────
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        loading: false,
      };
    case "LOGOUT":
      return { ...initialState, loading: false, accessToken: null, refreshToken: null, isAuthenticated: false };
    case "SET_USER":
      return { ...state, user: action.payload, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && state.accessToken) {
      try {
        dispatch({ type: "SET_USER", payload: JSON.parse(savedUser) });
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch({ type: "LOGOUT" });
      }
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // ── Actions ───────────────────────────────────────────
  const login = async (email, password, rememberMe = false) => {
    try {
      const { data } = await authAPI.login({ email, password, rememberMe });
      const { accessToken, refreshToken, user } = data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({ type: "LOGIN_SUCCESS", payload: { accessToken, refreshToken, user } });
      toast.success(`Welcome back, ${user.fullName || user.username}!`);
      return { success: true, user };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await authAPI.register(formData);
      toast.success("Account created! Please verify your email.");
      return { success: true, verificationToken: data.data?.verificationToken, user: data.data?.user };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      if (state.user?.id) await authAPI.logout(state.user.id);
    } catch {/* ignore */}
    localStorage.clear();
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully");
  };

  const isAdmin = () => state.user?.role === "ADMIN";
  const isDeveloper = () => state.user?.role === "DEVELOPER" || isAdmin();
  const isUser = () => !!state.user;

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, isAdmin, isDeveloper, isUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
