import { createContext, useState, useEffect } from "react";
import apiClient from "../api/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await apiClient.get("/auth/me");
          const userData = res.data?.data || res.data?.user || res.data;
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (credentials) => {
    const res = await apiClient.post("/auth/login", credentials);
    const data = res.data?.data || res.data;

    if (data?.requiresOtp) {
      return data;
    }

    const authToken = data?.token;
    const userData = data?.user;

    if (authToken) {
      localStorage.setItem("token", authToken);
      setToken(authToken);
    }
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    return data;
  };

  const signup = async (userDataInput) => {
    const res = await apiClient.post("/auth/register", userDataInput);
    const data = res.data?.data || res.data;
    return data;
  };

  const verifyOtp = async (email, otp) => {
    const res = await apiClient.post("/auth/verify-otp", { email, otp });
    const data = res.data?.data || res.data;
    const authToken = data?.token;
    const userData = data?.user;

    if (authToken) {
      localStorage.setItem("token", authToken);
      setToken(authToken);
    }
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    return data;
  };

  const resendOtp = async (email) => {
    const res = await apiClient.post("/auth/resend-otp", { email });
    return res.data?.data || res.data;
  };

  const forgotPassword = async (email) => {
    const res = await apiClient.post("/auth/forgot-password", { email });
    return res.data?.data || res.data;
  };

  const resetPassword = async (data) => {
    const res = await apiClient.post("/auth/reset-password", data);
    return res.data?.data || res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
