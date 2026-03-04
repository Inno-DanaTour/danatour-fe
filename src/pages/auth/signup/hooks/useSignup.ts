import { useState } from "react";
import { register as apiRegister } from "../services/signupService";
import { RegisterRequest } from "../types";
import { useNavigate } from "react-router-dom";

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await apiRegister(data);
      // Backend returns RegisterResponse.
      // We can notify the user to verify their email (in the component), then redirect to login.
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || "Registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSignup,
    loading,
    error,
    setError,
  };
};
