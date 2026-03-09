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
      if (response && response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);

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
      await apiLogout(token);
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("token");
      setLoading(false);
      navigate("/login");
    }
  };

  const handleRefreshToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentToken = localStorage.getItem("token") || "";
      const response = await apiRefreshToken(currentToken);
      if (response && response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
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
