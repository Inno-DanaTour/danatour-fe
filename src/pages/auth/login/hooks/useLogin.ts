import { useState } from "react";
import {
  login as apiLogin,
  logout as apiLogout,
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

  return {
    handleLogin,
    handleLogout,
    loading,
    error,
  };
};
