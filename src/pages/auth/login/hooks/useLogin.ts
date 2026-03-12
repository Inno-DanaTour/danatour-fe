import { useState } from "react";
import {
  login as apiLogin,
  logout as apiLogout,
  refreshToken as apiRefreshToken,
} from "../services/loginService";
import { LoginRequest } from "../types";
import { useNavigate } from "react-router-dom";
import { parseJwt } from "../../../../configs/api";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (data: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiLogin(data);
      if (response && response.data && response.data.token && response.data.refreshToken) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        // Parse token to check roles
        const payload = parseJwt(response.data.token);
        const scope = payload?.scope || "";

        if (scope.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else {
          navigate("/");
        }

        return response.data;
      }
      throw new Error(response.message || "Invalid response format");
    } catch (err: any) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const currentRefreshToken = localStorage.getItem("refreshToken") || getCookie("refresh_token") || undefined;
      await apiLogout(token, currentRefreshToken);
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setLoading(false);
      navigate("/login");
    }
  };

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  const handleRefreshToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentRefreshToken = localStorage.getItem("refreshToken") || getCookie("refresh_token") || "";
      if (!currentRefreshToken) {
        throw new Error("No refresh token found");
      }
      const response = await apiRefreshToken(currentRefreshToken);
      if (response && response.data && response.data.token && response.data.refreshToken) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        return response.data;
      }
      throw new Error(response.message || "Failed to refresh token");
    } catch (err: any) {
      setError(err.message || "Token refresh failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleLogin,
    handleLogout,
    handleRefreshToken,
    loading,
    error,
  };
};
